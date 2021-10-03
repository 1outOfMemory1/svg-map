import * as d3 from "d3";
import * as topojson from "./topojson";
import axios from "axios";
export {
    draw
}






//config模板
/*
let config = {
    width: 800,
    height: 800,
    svgDivId : "svg_map_div",
    svgId : "svg_map",
    chartColor: ["#e60012", "#f99507", "#edc900", "#007afe"],
    hoverLable: ["重大风险", "较大风险", "一级风险", "普通风险"],
    chartData: [
        {
            name: "福建省",
            value: [100, 40, 20, 30, 20]
        }
    ]
}
*/

async function draw(data,width,height) {
    const margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    }


    const box = d3.select('#svg_map_div')
    const svg = box.append('svg')
        .attr('width', width)
        .attr('height', height)

    const g = svg.append('g')
        .attr('transform', `translate(${margin.top}, ${margin.left})`)


    /*******      1、获得数据          *******/

    // 获取杭州的GeoJSON，然后转换出 TopoJSON 数据，并进行错误捕获
    let topo_data
    let geo_data
    try {
        // 获取到 GeoJSON 数据
        geo_data = data
        // 将 GeoJSON 数据转成 TopoJSON 格式
        topo_data = topojson.topology({
            geo: geo_data
        }, 1e6)
    } catch (e) {
        return console.error(e)
    }

    // console.log('topo_data', topo_data)
    console.log('geo_data', geo_data)

    // 如果只得到 TopoJSON 格式数据，可以使用 topojson.feature 来转换得到 GeoJSON
    // const geo_data2 = topojson.feature(topo_data, topo_data.objects.geo)
    // console.log('geo_data2', geo_data2) // 和 geo_data 一样
    // console.log('geo_data === geo_data2', geo_data === geo_data2) // false

    // 获取最外层轮廓路径的 GeoJSON
    const geo_border = topojson.merge(topo_data, topo_data.objects.geo.geometries)
    // console.log('geo_border', geo_border)

    // 获取不包含最外层轮廓的其余边界路径的 GeoJSON，得到
    // 的是一个单一的路径，不存在边界重叠问题
    const geo_interiors = topojson.mesh(topo_data, topo_data.objects.geo, (a, b) => a !== b)
    // console.log('geo_interiors', geo_interiors)

    /*******      2、创建和配置路径生成器函数       *******/

    const padding = 30;
    const x0 = padding;
    const y0 = padding;
    const x1 = width - padding * 2;
    const y1 = height - padding * 2;
        // 使用墨卡托投影 projection
    const projection = d3.geoMercator()
        .fitExtent(
            [
                [x0, y0], //左上角坐标
                [x1, y1], //右下角坐标
            ], geo_data);

    // 地理路径生成器
    const path = d3.geoPath()
        .projection(projection)

    /*******      3、结合前二者绘制图形        *******/

        // 开始绘制

        // 先确定好层级，绘制顺序决定 SVG 元素的层级
        // 第一层（最底层），各区域面积，这一层仅仅渲染区域颜色，不包含边框
    const areas_layer = g.append('g').attr('class', 'layer--areas')
    // 第二层，内部边界线路径
    const interiors_layer = g.append('g').attr('class', 'layer--interior')
    // 第三层，最外层轮廓路径
    const outline_layer = g.append('g').attr('class', 'layer--outline')
    // 第四层，遮罩层 & 交互层，包含完整地图，但默认隐藏；因为
    // 完全绘制会有内部边界重叠问题，所以仅用于交互时突出显示某个区域
    const area_overlays_layer = g.append('g').attr('class', 'layer--area_overlays')

    // 第五层，各区域中心点
    const centers_layer = g.append('g').attr('class', 'layer--psoints')

    // 绘制第一层面积层
    areas_layer
        .selectAll('path')
        .data(geo_data.features)
        .enter()
        .append('path')
        .attr('class', 'area')
        .attr('d', path)
        .attr('stroke', 'none')
        .attr('fill', 'skyblue')
        .attr("name",d => d.properties.name)
        .attr("code",d => d.properties.adcode)

    // // 绘制第四层交互层，因为容器层级顺序已定，所以这段代码顺序不影响
    // area_overlays_layer
    //     .selectAll('path')
    //     .data(geo_data.features)
    //     .enter()
    //     .append('path')
    //     .attr('class', 'area_overlay')
    //     .attr('d', path)
    //     .attr('stroke', 'none')
    //     .attr('fill', 'skyblue')
    //     .attr('opacity', 0)
    //     .attr("name",d => d.properties.name)
    //     // 提示文字
    //     .append('title')
    //     // 数据中每个几何对象都包含 properties 属性
    //     .text(d => d.properties.name)

    // 绘制第二层内部边界线
    interiors_layer
        .append('path')
        .datum(geo_interiors)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', '#333')
        .attr('stroke-dasharray', '2 3')

    // // 绘制第三层最外圈轮廓线
    // outline_layer
    //     .append('path')
    //     .datum(geo_border)
    //     .attr('d', path)
    //     .attr('fill', 'none')
    //     .attr('stroke', 'red')

    // 尝试 topojson.neighbors() 的使用；这个函数会返回各个区域（这里是feature）的相邻区域
    // const geo_neighbors = topojson.neighbors(topo_data.objects.geo.geometries)
    // console.log('geo_neighbors', geo_neighbors)
    //
    // const test_layer = g.append('g').attr('class', 'layer--test')
    // test_layer
    //   .selectAll('path')
    //   .data(geo_neighbors[0].map(i => geo_data.features[i]))
    //   .enter()
    //   .append('path')
    //   .attr('d', path)
    //   .attr('fill', 'yellow')
    //   .append('title')
    //   .text(d => d.properties.name)

    // 绘制第五层的各区域中心点以及标注名字
    centers_layer
        .style('pointer-events', 'none') // 这一层避免事件监听，免得影响交互层的交互
        .selectAll('.center_group')
        .data(geo_data.features)
        .enter()
        .append('g')
        .attr('class', 'center_group')
        .each(function (d) { // 内部有this引用，不能用箭头函数
            const el = d3.select(this)
            // d.properties中包含该区域的中心点和名字
            // 通过projection将地理坐标转换成绘图的平面坐标
            // console.log(d.properties.centroid)
            let [x,y] = [5000,5000]

            if(typeof (d.properties.centroid) !== "undefined"){
                 [x, y] = projection(d.properties.centroid)
            }else{
                 [x,y] = [5000,5000]
            }

            // 绘制圆点
            el.append('circle')
                .attr('cx', x+15)
                .attr('cy', y)
                .attr('r', 2)
                .attr('stroke', 'none')
                .attr('fill', '#000')

            // 添加地名文字
            el
                .append('text')
                .attr('x', x -10 )
                .attr('y', y -15)
                .attr('dy', '0.35em')
                .text(d.properties.name)
        })

    let path_list = document.getElementsByClassName("area")
    // console.log(path_list)
    for(let i=0;i<path_list.length;i++){
        // console.log(path_list[i])
        // path_list[i].getAttribute()
        path_list[i].addEventListener("click", (e)=>{
            // console.log(e.target.getAttribute("name"))
            let svg_div = document.getElementById("svg_map_div")
            let childs =svg_div.childNodes
            for(let i = childs.length - 1; i >= 0; i--) {
                // alert(childs[i].nodeName);
                svg_div.removeChild(childs[i]);
            }

            axios.get("http://localhost:9999/svg_map/getByName/" + e.target.getAttribute("name") ).then(res=>{
                draw(res.data.data,800,800)
            })
        })
    }



    // 可缩放
    // 监听滚轮事件 按照比例
    let svgPanel = document.getElementById("svg_map_div")
    console.log(svgPanel)
    // console.log(svgPanel[0])
    // var gridSvg = document.getElementById('grid');
    var scale = 1;
    function zoom(num, e) {
        // alert(1)
        console.log(scale)
        scale *= num;
        svgPanel.style.transform ='scale(' + scale + ')';
    }
    // 绑定鼠标滑轮
    // if (svgPanel.addEventListener) {
        svgPanel.addEventListener('DOMMouseScroll', scrollZoom, false);
    // }
    svgPanel.onmousewheel = document.onmousewhell = scrollZoom;
    /*
    * 滑轮滚动处理事件，向上滚动放大
    * {Object} e 事件对象
    */
    function scrollZoom(e) {
        e = e || window.event;
        // e.detail用来兼容FireFox
        e.wheelDelta > 0 || e.detail > 0 ? zoom(1.06, e) : zoom(0.94, e);
    }


}



function draw_svg(geojsonData,config){

    // draw("http://localhost:9999/svg_map/getByName/"+ "天津市",800,800)

    // console.log(geojsonData)
    // console.log(config)
    // if(geojsonData.features.length === 0 || geojsonData.type !=="FeatureCollection"){
    //     return
    // }
    // let path_list = []
    // let temp_path_d = ""
    // let svg_div = document.getElementById(config.svgDivId);
    // let features = geojsonData.features
    // for(let i = 0;i<features.length;i++){
    //     // console.log(features[i])
    //     let coordinates = features[i].geometry.coordinates[0][0]
    //     // console.log(coordinates)
    //     temp_path_d = "M" +coordinates[0][0]  +","+  coordinates[0][1]
    //     for(let j=1;j<coordinates.length;j++){
    //         // console.log(coordinates[j])
    //         temp_path_d += "L" + coordinates[j][0]  + "," +coordinates[j][1]
    //     }
    //     temp_path_d += "Z"
    //     // console.log(temp_path_d)
    //     path_list.push(temp_path_d)
    //
    // }
    // console.log(path_list)
    // let path_list_string = ""
    // for(let i=0;i<path_list.length;i++){
    //     path_list_string += `<path d="${path_list[i]}" stroke="#000000" style="fill: #FFFFFF" stroke-width="1"></path>`
    //     // console.log(path_list[i])
    // }
    //
    // console.log(path_list_string)
    // svg_div.innerHTML =`  <svg id="${config.svgId}" width="${config.width}" height="${config.height}">
    //     ${path_list_string}
    // </svg>`
}

<template>
  <div  style="width: 800px;height: 800px;overflow: hidden;position:relative">
    <div>
      <button id="return_lower_level" @click="return_lower_level">返回上一层</button>

    </div>
    <div>
      <button id="btn_all">全部</button>
      <button id="btn_level_1">重大风险</button>
      <button id="btn_level_2">较大风险</button>
      <button id="btn_level_3">一般风险</button>
      <button id="btn_level_4">普通风险</button></div>
    <div id="svg_map_div" style="width: 800px;height: 800px;">
    </div>
  </div>

</template>

<script>
import {draw} from "../assets/js/process_geojson"
// import {china_full_data} from "../assets/geojson/100000";

export default {
  created() {
    // draw_svg(res.data.data,{
    //   width: 1000,
    //   height: 1000,
    //   svgDivId : "svg_map_div",
    //   svgId : "svg_map",
    //   chartColor: ["#e60012", "#f99507", "#edc900", "#007afe"],
    //   hoverLable: ["重大风险", "较大风险", "一级风险", "普通风险"],
    //   chartData: [
    //     {
    //       name: "福建省",
    //       value: [100, 40, 20, 30, 20]
    //     }
    //   ]})
  },
  mounted() {
    localStorage.setItem("current_layer",1)
    // this.$http.get("https://router.haonan.tech:9999/svg_map/getByAdcode/" + "100000").then(res=>{
    //   draw(china_full_data,800,800)
    // })

    this.$http.get("https://router.haonan.tech:9999/svg_map/getByAdcode/" + "100000" ).then(res=>{
      draw(res.data.data,800,800)
    })
    // draw(china_full_data,800,800)
  },
  methods:{
    return_lower_level(){
      let current_layer = localStorage.getItem("current_layer")
      if(current_layer === "2"){
        // let full_china_data = JSON.parse( localStorage.getItem("full_china_data"))
        // console.log(full_china_data)
        this.$http.get("https://router.haonan.tech:9999/svg_map/getByAdcode/" + "100000" ).then(res=>{
          draw(res.data.data,800,800)
        })
         /* draw(china_full_data,800,800)*/
      }else {
        this.$http.get("https://router.haonan.tech:9999/svg_map/getByAdcode/" + localStorage.getItem("parent_map_name") ).then(res=>{
          draw(res.data.data,800,800)
        })

      }
      localStorage.setItem("current_layer",localStorage.getItem("current_layer") - 1)

    }
  }
}
</script>

<style  lang="scss">

.area_overlay:hover {
  fill: orange;
  stroke: yellow;
  opacity: 1;
}

#svg_map_div {
  position: absolute;
}
</style>

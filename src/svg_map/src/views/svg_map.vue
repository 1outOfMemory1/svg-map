<template>
  <div>
    <button >返回上一层</button>
    <div id="svg_map_div" style="width: 1000px;height: 1000px">

    </div>
  </div>

</template>

<script>
import {draw, draw_svg} from "../assets/js/process_geojson"

export default {
  mounted() {
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
  created() {
    this.$http.get("http://localhost:9999/svg_map/getByName/中国" ).then(res=>{
      draw(res.data.data,800,800)
    })
  },
  methods:{

  }
}
</script>

<style  lang="scss">
svg {
  border: 1px solid #ccc;
}

.area:hover {
  fill: orange;
  stroke: yellow;
  opacity: 1;
}
</style>

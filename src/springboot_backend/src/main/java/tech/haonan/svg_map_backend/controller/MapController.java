package tech.haonan.svg_map_backend.controller;

import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.*;
import tech.haonan.svg_map_backend.entity.CommonResponse;
import tech.haonan.svg_map_backend.utils.GeoJsonUtil;
import tech.haonan.svg_map_backend.utils.JsonUtil;

import javax.annotation.Resource;
import java.io.*;
import java.net.URL;


@RestController
@Api(tags = "获取svg_map geojson数据接口")
@RequestMapping("/svg_map")
@CrossOrigin
public class MapController {


    @ApiOperation(value = "获取所有地图adcode数据")
    @GetMapping("/getAllMapAdcode")
    public CommonResponse getAllMapAdcode(){
        return CommonResponse.success("获取所有地图adcode数据", JsonUtil.readJsonFile("allAdcode.json"));
    }

    @ApiOperation(value = "根据名称获取地图数据")
    @GetMapping("/getByName/{map_name}")
    public CommonResponse getByName(@PathVariable("map_name") String map_name){
        System.out.println(map_name);
        JSONObject all = GeoJsonUtil.getGeoJsonFileByFilePath("allAdcode.json");
        JSONObject result = GeoJsonUtil.getGeoJsonFileByFilePath( "geojson/" +all.get(map_name) + ".json");
        System.out.println(all );

        if(result != null)
            return CommonResponse.success("获取成功", result );
        else
            return CommonResponse.error("地图不存在");

    }


    @ApiOperation(value = "根据名称获取地图数据")
    @GetMapping("/getByAdcode/{code}")
    public CommonResponse getByAdcode(@PathVariable("code") String code){
        JSONObject result =GeoJsonUtil.getGeoJsonFileByFilePath( "geojson/" +code + ".json");
        if(result != null)
            return CommonResponse.success("获取成功", result );
        else
            return CommonResponse.error("地图不存在");
    }
}

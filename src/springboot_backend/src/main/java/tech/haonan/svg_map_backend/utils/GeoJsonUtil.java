package tech.haonan.svg_map_backend.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class GeoJsonUtil {
    public static JSONObject getGeoJsonFileByFilePath(String filePath){
       return   JsonUtil.readJsonFile(filePath);
    }

    public static void main(String[] args) {
        JSONObject all = GeoJsonUtil.getGeoJsonFileByFilePath("classpath:full.json");
        System.out.println(all.getString("山东省"));
    }
}

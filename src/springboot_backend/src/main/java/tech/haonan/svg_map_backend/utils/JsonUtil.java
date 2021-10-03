package tech.haonan.svg_map_backend.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.nio.file.Files;

public class JsonUtil {
    public static JSONObject readJsonFile(String filePath) {
        String jsonStr = "";
        try {
            File file = ResourceUtils.getFile(filePath);
            //Read File Content
            String content = new String(Files.readAllBytes(file.toPath()));
            //Get a Json String
//            System.out.println(content);
            JSONObject json = JSON.parseObject(content);
            return json;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}

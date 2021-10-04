package tech.haonan.svg_map_backend.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.util.ResourceUtils;
import springfox.documentation.spring.web.json.Json;
import tech.haonan.svg_map_backend.entity.City;

import java.io.*;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class JsonUtil {
    public static JSONObject readJsonFile(String filePath) {
        String jsonStr = "";
        try {
            String content =   new ClassPathResourceReader(filePath).getContent();

            //Get a Json String
//            System.out.println(content);
            JSONObject json = JSON.parseObject(content);
            return json;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    public static void main(String[] args) {
        String content =   new ClassPathResourceReader("level.json").getContent();
        List<City> cl= JSON.parseArray(content,City.class);
        Random r = new Random(1);
        Integer temp_all = 0;
        for(City ele1 : cl){
            Integer a = 0;
            Integer b = 0;
            Integer c = 0;
            Integer d = 0;
            for(City ele2: ele1.getAreaList()){
                Integer temp_level1 = 0;
                Integer temp_level2 = 0;
                Integer temp_level3 = 0;
                Integer temp_level4 = 0;
                for(City ele3:ele2.getAreaList()){
                    ele3.setRiskList(new ArrayList<Integer>());
                    int all = 0;
                    int temp = r.nextInt(1);
                    temp_level1 += temp;
                    all += temp;

                    ele3.getRiskList().add(temp);

                    temp = r.nextInt(1);
                    temp_level2 += temp;
                    all += temp;
                    ele3.getRiskList().add(temp);

                    temp = r.nextInt(1);
                    temp_level3 += temp;
                    all += temp;
                    ele3.getRiskList().add(temp);

                    temp = r.nextInt(2);
                    temp_level4 += temp;
                    all += temp;
                    ele3.getRiskList().add(temp);

                    ele3.getRiskList().add(all);
//                    System.out.println(ele3);
                }
                ele2.setRiskList(new ArrayList<>());
                ele2.getRiskList().add(temp_level1);
                ele2.getRiskList().add(temp_level2);
                ele2.getRiskList().add(temp_level3);
                ele2.getRiskList().add(temp_level4);
                ele2.getRiskList().add(temp_level1 + temp_level2 + temp_level3 + temp_level4);
//                System.out.println(ele2);
                a += temp_level1;
                b += temp_level2;
                c += temp_level3;
                d += temp_level4;
            }
            ele1.setRiskList(new ArrayList<>());
            ele1.getRiskList().add(a);
            ele1.getRiskList().add(b);
            ele1.getRiskList().add(c);
            ele1.getRiskList().add(d);
            ele1.getRiskList().add(a + b + c + d);
            System.out.println(ele1);
        }
    }
}

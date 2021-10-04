package tech.haonan.svg_map_backend.controller;

import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;
import tech.haonan.svg_map_backend.entity.City;
import tech.haonan.svg_map_backend.entity.CommonResponse;
import tech.haonan.svg_map_backend.utils.ClassPathResourceReader;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@Api(tags = "获取危险等级的数据接口")
@RequestMapping("/risk_level")
@CrossOrigin
public class RiskController {
    static  private  List<City> cl;
    RiskController(){
        String content =   new ClassPathResourceReader("level.json").getContent();
        cl= JSON.parseArray(content,City.class);
        Random r = new Random(1);
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
//            System.out.println(ele1);
        }
    }

    @ApiOperation(value = "根据城市省份名字获取当前层和下一层的危险等级数据")
    @GetMapping("/getRiskLevelByName/{map_name}")
    public CommonResponse getRiskLevelByName(@PathVariable("map_name") String map_name){
        return CommonResponse.error("功能未开发");
    }

    @ApiOperation(value = "返回所有数据")
    @GetMapping("/getAllRiskLevel/")
    public CommonResponse getAllRiskLevel(){
        return CommonResponse.success("所有城市数据",cl);
    }
}

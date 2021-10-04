package tech.haonan.svg_map_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class City {
    private String code;
    private int level;
    private String name;
    private ArrayList<Integer> riskList;
    private ArrayList<City> areaList;
}

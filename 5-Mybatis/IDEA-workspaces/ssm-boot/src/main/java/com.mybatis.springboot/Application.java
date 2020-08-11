package com.mybatis.springboot;

import com.mybatis.springboot.mapper.CountryMapper;
import com.mybatis.springboot.model.Country;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;

/**
 * @ClassName Application
 * @Description TODO
 * @Author davidt
 * @Date 5/21/2020 5:46 PM
 * @Version 1.0
 **/

@SpringBootApplication
@MapperScan(value = {"com.mybatis.springboot.mapper", "com.kyss.simple.mapper"}, nameGenerator = MapperNameGenerator.class)
public class Application implements CommandLineRunner {

    @Autowired
    private CountryMapper countryMapper;

    public static void main(String[]  args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        List<Country> countryList = countryMapper.selectAll();
        System.out.println(countryList.get(0).getCountryName());
        System.out.println("RUN HERE!");
    }
}

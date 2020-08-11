package com.mybatis.springboot.mapper;

import com.mybatis.springboot.model.Country;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @ClassName CountryMapper
 * @Description TODO
 * @Author davidt
 * @Date 5/22/2020 9:27 AM
 * @Version 1.0
 **/

@Mapper
public interface CountryMapper {

    List<Country> selectAll();
}

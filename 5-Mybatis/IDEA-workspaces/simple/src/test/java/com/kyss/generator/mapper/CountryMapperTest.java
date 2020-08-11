package com.kyss.generator.mapper;

import com.kyss.generator.model.Country;
import com.kyss.generator.model.CountryExample;
import com.kyss.simple.mapper.BaseMapperTest;
import org.junit.Test;

import java.util.List;

/**
 * @ClassName CountryMapperTest
 * @Description TODO
 * @Author davidt
 * @Date 4/20/2020 5:43 PM
 * @Version 1.0
 **/
public class CountryMapperTest<T> extends BaseMapperTest<T> {

    @Test
    public void testExample() {
        CountryMapper countryMapper = this.getMapper(CountryMapper.class);
        Country country = countryMapper.selectByPrimaryKey(1);
        System.out.println(country.getCountryname());

        CountryExample example = new CountryExample();
        example.setOrderByClause("id desc, countryname asc");
        example.setDistinct(true);
        CountryExample.Criteria criteria = example.createCriteria();
        criteria.andIdLessThan(4);
        criteria.andCountrycodeLike("%U%");
//        CountryExample.Criteria or = example.or();
//        or.andCountrynameEqualTo("Chinese");
        example.or().andCountrynameEqualTo("印度");
        List<Country> countryList = countryMapper.selectByExample(example);
        printCountryList(countryList);
    }

    private void printCountryList(List<Country> countryList) {
        for (Country country : countryList) {
            System.out.printf("%-4d%4s%4s\n",
                    country.getId(),
                    country.getCountryname(),
                    country.getCountrycode());
        }
    }
}
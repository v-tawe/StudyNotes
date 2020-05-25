package com.mybatis.springboot.model;

/**
 * @ClassName Country
 * @Description TODO
 * @Author davidt
 * @Date 5/22/2020 9:26 AM
 * @Version 1.0
 **/
public class Country {
    private Long id;
    private String countryName;
    private String countryCode;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }
}

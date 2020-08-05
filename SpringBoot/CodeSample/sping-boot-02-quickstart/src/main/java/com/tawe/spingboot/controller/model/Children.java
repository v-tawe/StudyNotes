package com.tawe.spingboot.controller.model;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @ClassName Chirldren
 * @Description TODO
 * @Author davidt
 * @Date 7/23/2020 4:57 PM
 * @Version 1.0
 **/

@Component
@ConfigurationProperties(prefix = "child")
public class Children {
    private Long id;
    private String name;
    private Integer age;

    private Person father;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Person getFather() {
        return father;
    }

    public void setFather(Person father) {
        this.father = father;
    }

    @Override
    public String toString() {
        return "Children{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", father=" + father +
                '}';
    }
}

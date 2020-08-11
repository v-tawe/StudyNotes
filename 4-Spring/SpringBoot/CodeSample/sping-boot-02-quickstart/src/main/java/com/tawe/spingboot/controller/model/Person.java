package com.tawe.spingboot.controller.model;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @ClassName Person
 * @Description TODO
 * @Author davidt
 * @Date 7/23/2020 4:54 PM
 * @Version 1.0
 **/

@Component
@ConfigurationProperties(prefix = "person")
public class Person {
    private Long id;
    private String name;
    private Integer age;

    public Map<Integer, String> getMap() {
        return map;
    }

    public void setMap(Map<Integer, String> map) {
        this.map = map;
    }

    public List<String> getList() {
        return list;
    }

    public void setList(List<String> list) {
        this.list = list;
    }

    public Children getChildren() {
        return children;
    }

    public void setChildren(Children children) {
        this.children = children;
    }

    private Map<Integer, String> map;
    private List<String> list;
    private Children children;

    public Person() {
    }

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

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", map=" + map +
                ", list=" + list +
                ", children=" + children +
                '}';
    }
}

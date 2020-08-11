package com.tawe.spingboot.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @ClassName HelloController
 * @Description TODO
 * @Author davidt
 * @Date 7/23/2020 4:53 PM
 * @Version 1.0
 **/

@RestController
public class HelloController {

    @RequestMapping("/")
    public String hello() {
        return "Hello world!";
    }
}

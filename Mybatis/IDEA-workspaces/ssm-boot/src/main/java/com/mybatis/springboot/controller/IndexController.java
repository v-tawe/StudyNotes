package com.mybatis.springboot.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @ClassName IndexController
 * @Description TODO
 * @Author davidt
 * @Date 5/21/2020 5:48 PM
 * @Version 1.0
 **/

@RestController
public class IndexController {

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }
}

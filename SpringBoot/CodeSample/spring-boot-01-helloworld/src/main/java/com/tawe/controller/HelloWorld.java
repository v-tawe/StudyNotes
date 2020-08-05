package com.tawe.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @ClassName HelloWorld
 * @Description TODO
 * @Author davidt
 * @Date 7/23/2020 4:04 PM
 * @Version 1.0
 **/

@Controller
public class HelloWorld {

    @ResponseBody
    @RequestMapping("/hello")
    public String sayHello() {
        return "Hello world!";
    }
}

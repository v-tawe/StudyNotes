package com.tawe.springcloudalibaba.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @ClassName FlowLimitController
 * @Description TODO
 * @Author davidt
 * @Date 9/3/2020 3:18 PM
 * @Version 1.0
 **/
@RestController
public class FlowLimitController {
    @GetMapping("/testA")
    public String testA() {
        return "----testA";
    }
    @GetMapping("/testB")
    public String testB() {
        return "----testB";
    }
}

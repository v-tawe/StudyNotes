package com.tawe.springboot.controller;

import com.tawe.springboot.service.OrderHystrixService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @ClassName OrderHystrixController
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 4:38 PM
 * @Version 1.0
 **/
@RestController
@Slf4j
public class OrderHystrixController {

    @Resource
    private OrderHystrixService orderHystrixService;

    @GetMapping("/consumer/payment/hystrix/ok")
    public String paymentInofOK() {
//        int i = 10/0;
        return orderHystrixService.paymentInfoOK();
    }

    @GetMapping("/consumer/payment/hystrix/timeout")
    public String paymentInfoTimeout() {
        return orderHystrixService.paymentInfoTimeout();
    }
}

package com.tawe.springcloudalibaba.controller;

import com.tawe.springcloud.entities.CommonResult;
import com.tawe.springcloud.entities.Payment;
import com.tawe.springcloudalibaba.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @ClassName OrderOpenFeignController
 * @Description TODO
 * @Author davidt
 * @Date 9/7/2020 4:54 PM
 * @Version 1.0
 **/
@RestController
@Slf4j
public class OrderOpenFeignController {
    @Resource
    private PaymentService paymentService;

    @GetMapping("/consumer/openFeign/getResourceById/{id}")
    public CommonResult getResourceById(@PathVariable("id")Long id){
        return paymentService.paymentSQL(id);
    }
}

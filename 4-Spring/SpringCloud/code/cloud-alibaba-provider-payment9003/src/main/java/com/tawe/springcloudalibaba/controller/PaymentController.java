package com.tawe.springcloudalibaba.controller;

import com.tawe.springcloud.entities.CommonResult;
import com.tawe.springcloud.entities.Payment;
import com.tawe.springcloudalibaba.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @ClassName PaymentController
 * @Description TODO
 * @Author davidt
 * @Date 9/7/2020 2:52 PM
 * @Version 1.0
 **/
@RestController
@Slf4j
public class PaymentController {
    @Value("${server.port}")
    private String port;

    @Resource
    private PaymentService paymentService;

    @GetMapping("/paymentSQL/{id}")
    public CommonResult paymentSQL(@PathVariable("id") Long id) {
        Payment payment = paymentService.getPaymentById(id);
        if (payment != null) {
            return new CommonResult(200, ";\tserverPort: " + port, payment);
        }
//        return new CommonResult(400, "no resource found!");
        throw new NullPointerException("服务 ID 不存在");
    }
}

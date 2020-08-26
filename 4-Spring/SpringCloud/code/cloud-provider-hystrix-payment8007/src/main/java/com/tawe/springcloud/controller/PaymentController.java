package com.tawe.springcloud.controller;

import com.tawe.springcloud.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @ClassName PaymentController
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 4:27 PM
 * @Version 1.0
 **/
@RestController
@Slf4j
public class PaymentController {
    @Resource
    private PaymentService paymentService;

    @GetMapping("/payment/hystrix/ok")
    public String paymentInfoOK() {
        return paymentService.paymentInfoOK();
    }

    @GetMapping("/payment/hystrix/timeout")
    public String paymentInfoTimeout() {
        return paymentService.paymentInfoTimeout();
    }

    @GetMapping("/payment/hystrix/circuit/{id}")
    public String paymentCircuitBreaker(@PathVariable("id") Integer id) {
        return paymentService.paymentCircuitBreaker(id);
    }
}

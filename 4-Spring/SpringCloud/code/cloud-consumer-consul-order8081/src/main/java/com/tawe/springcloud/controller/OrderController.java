package com.tawe.springcloud.controller;

import com.tawe.springcloud.entities.CommonResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

/**
 * @ClassName OrderController
 * @Description TODO
 * @Author davidt
 * @Date 8/21/2020 10:30 AM
 * @Version 1.0
 **/
@RestController
public class OrderController {
    @Resource
    private RestTemplate restTemplate;

    public static final String PAYMENT_URL = "http://consul-provider-payment";

    @GetMapping("/consumer/payment/consul")
    public CommonResult paymentConsul() {
        return restTemplate.getForObject(PAYMENT_URL + "/payment/consul", CommonResult.class);
    }
}

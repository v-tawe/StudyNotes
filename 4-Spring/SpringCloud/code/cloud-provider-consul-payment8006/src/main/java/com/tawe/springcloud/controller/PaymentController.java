package com.tawe.springcloud.controller;

import com.tawe.springcloud.entities.CommonResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.UUID;

/**
 * @ClassName PaymentController
 * @Description TODO
 * @Author davidt
 * @Date 8/21/2020 10:04 AM
 * @Version 1.0
 **/
@RestController
@Slf4j
public class PaymentController {

    @Value("${server.port}")
    private String serverPort;

    @GetMapping("/payment/consul")
    public CommonResult paymentConsul() {
        return new CommonResult(200, "*****查询 consul discovery", "springcloud with consul: " + serverPort + "\t" + UUID.randomUUID().toString());
    }
}


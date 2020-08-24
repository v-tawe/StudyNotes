package com.tawe.springcloud.controller;

import com.tawe.springcloud.entities.CommonResult;
import com.tawe.springcloud.entities.Payment;
import com.tawe.springcloud.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

/**
 * @ClassName PaymentController
 * @Description TODO
 * @or davidt
 * @Date 8/19/2020 6:23 PM
 * @Version 1.0
 **/
@RestController
@Slf4j
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Value("${server.port}")
    private String port;

    @PostMapping(value = "/payment/create")
    public CommonResult create(@RequestBody Payment payment) {
        int result = paymentService.create(payment);
        log.info("*****插入结果：{}", result);

        if (result > 0) {
            return new CommonResult(200, "插入数据库成功, 端口号: " + port, null);
        } else {
            return new CommonResult(500, "插入数据库失败, 端口号: " + port, null);
        }
    }

    @GetMapping(value = "/payment/get/{id}")
    public CommonResult getPaymentById(@PathVariable("id") Long id) {

        Payment payment = paymentService.getPaymentById(id);
        log.info("********查询结果：{}", payment);

        if (payment != null) {
            return new CommonResult(200, "查询成功, 端口号: " + port, payment);
        } else {
            return new CommonResult(500, "查询失败，数据库无该记录, 端口号: " + port,null);
        }
    }

    @GetMapping(value = "/payment/lb")
    public String getPaymentLB() {
        return port;
    }
}

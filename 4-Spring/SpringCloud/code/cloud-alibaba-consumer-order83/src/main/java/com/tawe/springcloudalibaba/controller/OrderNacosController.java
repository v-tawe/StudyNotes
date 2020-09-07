package com.tawe.springcloudalibaba.controller;

import com.tawe.springcloudalibaba.service.OrderNacosService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @ClassName OrderNacosController
 * @Description TODO
 * @Author davidt
 * @Date 9/1/2020 5:53 PM
 * @Version 1.0
 **/

@RestController
@Slf4j
public class OrderNacosController {
    @Resource
    private OrderNacosService orderNacosService;

    @GetMapping("/consumer/payment/nacos/{id}")
    public String getPayment(@PathVariable("id") Integer id) {
        return orderNacosService.getPayment(id);
    }
}

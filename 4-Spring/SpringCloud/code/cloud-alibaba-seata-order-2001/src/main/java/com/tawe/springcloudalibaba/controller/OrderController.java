package com.tawe.springcloudalibaba.controller;

import com.tawe.springcloud.entities.CommonResult;
import com.tawe.springcloudalibaba.entity.Order;
import com.tawe.springcloudalibaba.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @ClassName OrderController
 * @Description TODO
 * @Author davidt
 * @Date 9/8/2020 2:43 PM
 * @Version 1.0
 **/
@RestController
public class OrderController {
    @Resource
    private OrderService orderService;

    @GetMapping("/order/createOrder")
    public CommonResult create(Order order) {
        orderService.createOrder(order);
        return new CommonResult(200, "订单创建成功");
    }
}

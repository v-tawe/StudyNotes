package com.tawe.springcloudalibaba.service;

import com.tawe.springcloudalibaba.entity.Order;
import org.springframework.stereotype.Service;

/**
 * @ClassName OrderService
 * @Description TODO
 * @Author davidt
 * @Date 9/8/2020 1:29 PM
 * @Version 1.0
 **/
public interface OrderService {
    void createOrder(Order order);
}

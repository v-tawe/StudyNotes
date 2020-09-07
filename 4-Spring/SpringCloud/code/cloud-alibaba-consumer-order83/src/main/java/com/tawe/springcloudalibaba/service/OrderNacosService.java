package com.tawe.springcloudalibaba.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * @ClassName OrderNacosService
 * @Description TODO
 * @Author davidt
 * @Date 9/1/2020 5:55 PM
 * @Version 1.0
 **/
@Component
@FeignClient("nacos-payment-provider")
public interface OrderNacosService {

    @GetMapping("/payment/nacos/{id}")
    String getPayment(@PathVariable("id") Integer id);
}

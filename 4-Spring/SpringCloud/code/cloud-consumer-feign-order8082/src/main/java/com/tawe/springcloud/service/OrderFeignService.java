package com.tawe.springcloud.service;

import com.tawe.springcloud.entities.CommonResult;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * @ClassName OrderFeignService
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 2:14 PM
 * @Version 1.0
 **/
@Component
@FeignClient("CLOUD-PAYMENT-SERVICE")
public interface OrderFeignService {

    @GetMapping("/payment/get/{id}")
    CommonResult getPaymentById(@PathVariable("id")Long id);

    @GetMapping("/payment/timeout")
    String getTimeout();
}

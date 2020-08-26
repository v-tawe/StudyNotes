package com.tawe.springboot.service;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixProperty;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * @ClassName OrderHystrixService
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 4:39 PM
 * @Version 1.0
 **/
@Component
@FeignClient(value = "CLOUD-PROVIDER-HYSTRIX-PAYMENT", fallback = OrderHystrixServiceHandler.class)
public interface OrderHystrixService {
    @GetMapping("/payment/hystrix/ok")
    public String paymentInfoOK();

    @GetMapping("/payment/hystrix/timeout")
    public String paymentInfoTimeout();

}

package com.tawe.springcloud.service.impl;

import cn.hutool.core.util.IdUtil;
import com.netflix.hystrix.contrib.javanica.annotation.DefaultProperties;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixProperty;
import com.tawe.springcloud.service.PaymentService;
import org.springframework.stereotype.Service;

/**
 * @ClassName PaymentServiceImpl
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 4:24 PM
 * @Version 1.0
 **/
@Service
@DefaultProperties(defaultFallback = "paymentGlobalFallback")
public class PaymentServiceImpl implements PaymentService {

    private int count = 0;
    private int fallbackCount = 0;

    @Override
    @HystrixCommand
    public String paymentInfoOK() {
//        int i = 1/0;
        return "线程池：" + Thread.currentThread().getName() + "\t paymentInfoOK";
    }

    @Override
    @HystrixCommand(fallbackMethod = "paymentInfoTimeoutHandler", commandProperties = {
            @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value = "5000")
    })
    public String paymentInfoTimeout() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "线程池：" + Thread.currentThread().getName() + "\t paymentInfoTimeout";
    }

    public String paymentInfoTimeoutHandler() {
        return "服务降级...paymentInfoTimeoutHandler";
    }

    public String paymentGlobalFallback() { return "Global 服务降级... paymentGlobalFallback"; }

    /******************** 服务熔断 ***********************/
    @Override
    @HystrixCommand(fallbackMethod = "paymentCircuitBreakerFallback", commandProperties = {
            @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value = "5000"),
            @HystrixProperty(name = "circuitBreaker.enabled", value = "true"),
            @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "10"),
            @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds", value = "1000"),
            @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value = "80")
    })
    public String paymentCircuitBreaker(Integer id) {
        count ++;
        if (id < 0)  {
            throw new RuntimeException("***************id 不可以小于 0");
        }
        String serialNum = IdUtil.simpleUUID();
        return Thread.currentThread().getName() + "\t 调用成功, 流水号：" + serialNum;
    }

    public String paymentCircuitBreakerFallback(Integer id) {
        fallbackCount ++;
        System.out.println("count: " + count + "\tfallbackCount: " + fallbackCount);
        return "服务熔断 callback... paymentCircuitBreakerFallback";
    }
}

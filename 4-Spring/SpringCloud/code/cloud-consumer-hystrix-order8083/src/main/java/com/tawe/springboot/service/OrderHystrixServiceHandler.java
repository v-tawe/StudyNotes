package com.tawe.springboot.service;

import org.springframework.stereotype.Component;

/**
 * @ClassName paymentInfoOKHandler
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 5:40 PM
 * @Version 1.0
 **/
@Component
public class OrderHystrixServiceHandler implements OrderHystrixService{

    @Override
    public String paymentInfoOK() {
        return "调用者服务降级...paymentInfoOK";
    }

    @Override
    public String paymentInfoTimeout() {
        return "调用者服务降级...paymentInfoTimeout";
    }
}

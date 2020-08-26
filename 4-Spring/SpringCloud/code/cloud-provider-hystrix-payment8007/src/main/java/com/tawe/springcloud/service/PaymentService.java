package com.tawe.springcloud.service;

/**
 * @ClassName PaymentService
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 4:24 PM
 * @Version 1.0
 **/

public interface PaymentService {
    public String paymentInfoOK();
    public String paymentInfoTimeout();
    public String paymentCircuitBreaker(Integer id);
}

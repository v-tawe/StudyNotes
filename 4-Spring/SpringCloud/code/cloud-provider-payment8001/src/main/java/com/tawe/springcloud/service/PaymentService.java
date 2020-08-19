package com.tawe.springcloud.service;

import com.tawe.springcloud.entities.Payment;
import org.apache.ibatis.annotations.Param;

/**
 * @ClassName PaymentSrvice
 * @Description TODO
 * @Author davidt
 * @Date 8/19/2020 6:21 PM
 * @Version 1.0
 **/
public interface PaymentService {
    public int create(Payment payment);

    public Payment getPaymentById(@Param("id")Long id);
}

package com.tawe.springcloudalibaba.service;

import com.tawe.springcloud.entities.CommonResult;
import org.springframework.stereotype.Component;

/**
 * @ClassName PaymentServiceImpl
 * @Description TODO
 * @Author davidt
 * @Date 9/7/2020 4:53 PM
 * @Version 1.0
 **/
@Component
public class PaymentServiceImpl implements PaymentService {
    @Override
    public CommonResult paymentSQL(Long id) {
        return new CommonResult(444, "Openfeign 服务降级");
    }
}

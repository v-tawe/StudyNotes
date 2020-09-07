package com.tawe.springcloudalibaba.service;

import com.tawe.springcloud.entities.Payment;
import com.tawe.springcloudalibaba.dao.PaymentDao;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @ClassName PaymentService
 * @Description TODO
 * @Author davidt
 * @Date 9/7/2020 3:31 PM
 * @Version 1.0
 **/

@Service
public class PaymentService {

    @Resource
    private PaymentDao paymentDao;

    public Payment getPaymentById(Long id) {
        return paymentDao.getPaymentById(id);
    }
}

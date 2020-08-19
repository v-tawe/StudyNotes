package com.tawe.springcloud.service.impl;

import com.tawe.springcloud.dao.PaymentDao;
import com.tawe.springcloud.entities.Payment;
import com.tawe.springcloud.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @ClassName PaymentServiceImpl
 * @Description TODO
 * @Author davidt
 * @Date 8/19/2020 6:21 PM
 * @Version 1.0
 **/
@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentDao paymentDao;

    @Override
    public int create(Payment payment) {
        return paymentDao.create(payment);
    }

    @Override
    public Payment getPaymentById(Long id) {
        return paymentDao.getPaymentById(id);
    }
}

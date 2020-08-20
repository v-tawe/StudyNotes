package com.tawe.springcloud.dao;

import com.tawe.springcloud.entities.Payment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * @ClassName PaymentDao
 * @Description TODO
 * @Author davidt
 * @Date 8/19/2020 6:14 PM
 * @Version 1.0
 **/
@Mapper
public interface PaymentDao {
    public int create(Payment payment);

    public Payment getPaymentById(@Param("id")Long id);
}

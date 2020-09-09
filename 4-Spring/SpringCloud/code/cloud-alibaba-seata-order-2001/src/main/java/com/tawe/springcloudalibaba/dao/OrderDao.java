package com.tawe.springcloudalibaba.dao;

import com.tawe.springcloudalibaba.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * @ClassName OrderDao
 * @Description TODO
 * @Author davidt
 * @Date 9/8/2020 2:37 PM
 * @Version 1.0
 **/
@Mapper
public interface OrderDao {
    int createOrder(Order order);
    int updateOrder(@Param("id") Long id, @Param("status")Integer status);

}

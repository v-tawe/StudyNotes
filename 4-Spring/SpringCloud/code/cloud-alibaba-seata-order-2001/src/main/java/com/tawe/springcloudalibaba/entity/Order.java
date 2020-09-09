package com.tawe.springcloudalibaba.entity;

import lombok.Data;

import java.math.BigDecimal;

/**
 * @ClassName Order
 * @Description TODO
 * @Author davidt
 * @Date 9/8/2020 2:36 PM
 * @Version 1.0
 **/
@Data
public class Order {
    private Long id;
    private Long userId;
    private Long productId;
    private Integer count;
    private BigDecimal money;
    private Integer status;
}

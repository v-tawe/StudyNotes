package com.tawe.springcloudalibaba.service;

import java.math.BigDecimal;

/**
 * @ClassName AccountService
 * @Description TODO
 * @Author davidt
 * @Date 9/8/2020 2:42 PM
 * @Version 1.0
 **/
public interface AccountService {
    int decrease(Long userId, BigDecimal money);
}

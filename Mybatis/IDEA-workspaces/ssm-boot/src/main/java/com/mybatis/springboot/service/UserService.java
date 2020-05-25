package com.mybatis.springboot.service;

import com.kyss.simple.model.SysUser;

import java.util.List;

/**
 * @ClassName UserService
 * @Description TODO
 * @Author davidt
 * @Date 5/22/2020 10:23 AM
 * @Version 1.0
 **/
public interface UserService {
    SysUser findById(Long id);
    List<SysUser> findAll();
}

package com.tawe.crowd.service;

import com.tawe.crowd.entity.Admin;

import java.util.List;

/**
 * @ClassName AdminService
 * @Description TODO
 * @Author Administrator
 * @Date 9/23/2020 1:59 PM
 * @Version 1.0
 **/
public interface AdminService {
    int save(Admin user);

    List<Admin> selectAll();

    Admin selectById(Integer id);
}

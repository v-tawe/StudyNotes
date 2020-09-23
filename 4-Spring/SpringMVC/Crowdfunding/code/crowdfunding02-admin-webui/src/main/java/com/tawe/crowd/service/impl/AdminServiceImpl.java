package com.tawe.crowd.service.impl;

import com.tawe.crowd.dao.AdminMapper;
import com.tawe.crowd.entity.Admin;
import com.tawe.crowd.entity.AdminExample;
import com.tawe.crowd.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @ClassName AdminServiceImpl
 * @Description TODO
 * @Author Administrator
 * @Date 9/23/2020 2:00 PM
 * @Version 1.0
 **/

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminMapper adminMapper;

    @Override
    public int save(Admin user) {
        return adminMapper.insert(user);
    }

    @Override
    public List<Admin> selectAll() {
        return adminMapper.selectByExample(new AdminExample());
    }

    @Override
    public Admin selectById(Integer id) {
        return adminMapper.selectByPrimaryKey(id);
    }
}

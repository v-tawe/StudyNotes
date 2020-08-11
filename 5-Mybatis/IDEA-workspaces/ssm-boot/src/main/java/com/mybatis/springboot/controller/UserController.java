package com.mybatis.springboot.controller;

import com.kyss.simple.model.SysUser;
import com.mybatis.springboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @ClassName UserController
 * @Description TODO
 * @Author davidt
 * @Date 5/22/2020 10:29 AM
 * @Version 1.0
 **/

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping("users/{id}")
    SysUser user(@PathVariable("id") Long id) {
        return userService.findById(id);
    }

    @RequestMapping("users")
    List<SysUser> users() {
        return userService.findAll();
    }
}

package com.tawe.crowd.mvc.controller;

import com.tawe.crowd.customize.exception.LoginFailedException;
import com.tawe.crowd.customize.exception.SystemErrorException;
import com.tawe.crowd.entity.Admin;
import com.tawe.crowd.service.AdminService;
import com.tawe.crowd.util.ResultEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * @ClassName AdminController
 * @Description TODO
 * @Author Administrator
 * @Date 9/23/2020 3:27 PM
 * @Version 1.0
 **/
@Controller
public class AdminController {

    @Autowired
    private AdminService adminService;

    @RequestMapping("test/ssm.html")
    public String ssmIndex(ModelMap modelMap) throws LoginFailedException {
        List<Admin> admins = adminService.selectAll();
        modelMap.addAttribute("admins", admins);
        // throw new LoginFailedException();
        return "target";
    }

    @RequestMapping("test/login_exception.html")
    public String testException() throws LoginFailedException {
        throw new LoginFailedException();
    }

    @RequestMapping("test/sys_exception.html")
    public String testSystemErrorException() throws SystemErrorException {
        throw new SystemErrorException("system error message!");
    }

    @ResponseBody
    @RequestMapping("test/ajax.json")
    public ResultEntity<List<Admin>> getUserById(@RequestBody Integer[] ids) {
        List<Admin> admins = new ArrayList<>();
        for (Integer id : ids) {
            admins.add(adminService.selectById(id));
        }
        return ResultEntity.succeededWithData(admins);
    }
}

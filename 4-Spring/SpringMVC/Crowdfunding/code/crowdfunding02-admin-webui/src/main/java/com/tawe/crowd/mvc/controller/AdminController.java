package com.tawe.crowd.mvc.controller;

import com.tawe.crowd.entity.Admin;
import com.tawe.crowd.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
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
    public String ssmIndex(ModelMap modelMap) {
        List<Admin> admins = adminService.selectAll();
        modelMap.addAttribute("admins", admins);
        return "target";
    }

    @ResponseBody
    @RequestMapping("test/ajax.json")
    public Admin getUserById(@RequestParam("id") Integer id) {
        return adminService.selectById(id);
    }
}

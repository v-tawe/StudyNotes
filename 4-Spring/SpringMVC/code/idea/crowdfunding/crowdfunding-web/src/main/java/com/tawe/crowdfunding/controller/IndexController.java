package com.tawe.crowdfunding.controller;

import com.tawe.crowdfunding.service.IndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @ClassName IndexController
 * @Description TODO
 * @Author davidt
 * @Date 9/9/2020 6:57 PM
 * @Version 1.0
 **/
@Controller
public class IndexController {

    @Autowired
    private IndexService indexService;

    @RequestMapping("/index")
    public String index() {
        return indexService.index();
    }
}

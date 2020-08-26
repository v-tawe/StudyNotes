package com.tawe.springcloud.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @ClassName ConfigClientController
 * @Description TODO
 * @Author davidt
 * @Date 8/26/2020 10:38 AM
 * @Version 1.0
 **/
@RestController
@RefreshScope
public class ConfigClientController {
    @Value("${config.info}")
    private String configInfo;

    @GetMapping("/getConfigInfo")
    public String getConfigInfo() {
        return configInfo;
    }
}

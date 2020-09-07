package com.tawe.springcloud.controller;

import com.tawe.springcloud.service.IMessageProvider;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @ClassName SendMessageController
 * @Description TODO
 * @Author davidt
 * @Date 8/26/2020 4:59 PM
 * @Version 1.0
 **/
@RestController
public class SendMessageController {
    @Resource
    private IMessageProvider messageProvider;

    @GetMapping("/sendMessage/{msg}")
    public String sendMessage(@PathVariable("msg")String msg)
    {
        return messageProvider.send(msg);
    }
}

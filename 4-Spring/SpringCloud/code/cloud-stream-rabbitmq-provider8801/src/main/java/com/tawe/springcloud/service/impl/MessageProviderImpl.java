package com.tawe.springcloud.service.impl;

/**
 * @ClassName MessageProviderImpl
 * @Description TODO
 * @Author davidt
 * @Date 8/26/2020 4:54 PM
 * @Version 1.0
 **/

import com.tawe.springcloud.service.IMessageProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.messaging.Source;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;

import javax.annotation.Resource;

@EnableBinding(Source.class)
@Slf4j
public class MessageProviderImpl implements IMessageProvider {
    @Resource
    private MessageChannel output;

    @Override
    public String send(String msg) {
//        String serial = cn.hutool.core.util.IdUtil.simpleUUID();
        output.send(MessageBuilder.withPayload(msg).build());
        log.info("***********Message: " + msg);
        return msg;
    }
}

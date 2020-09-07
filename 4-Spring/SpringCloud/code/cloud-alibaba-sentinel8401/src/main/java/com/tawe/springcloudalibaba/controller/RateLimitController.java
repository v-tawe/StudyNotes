package com.tawe.springcloudalibaba.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.tawe.springcloud.entities.CommonResult;
import com.tawe.springcloud.entities.Payment;
import com.tawe.springcloudalibaba.handler.CustomerBlockHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @ClassName RateLimitController
 * @Description TODO
 * @Author davidt
 * @Date 9/7/2020 2:17 PM
 * @Version 1.0
 **/
@RestController
public class RateLimitController {
    @GetMapping("/byResource")
//    @SentinelResource(value = "byResource", blockHandler = "handleException")
    @SentinelResource(value = "byResource", blockHandlerClass = CustomerBlockHandler.class, blockHandler = "handleException")
    public CommonResult byResource() {
        return new CommonResult(200, "按资源名称限流：", new Payment(2020L, "serial001"));
    }

    public CommonResult handleException(BlockException exception) {
        return new CommonResult(444, exception.getClass().getCanonicalName() + "\t 服務不可用");
    }
}

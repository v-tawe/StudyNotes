package com.tawe.springcloudalibaba.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.tawe.springcloud.entities.CommonResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

/**
 * @ClassName OrderController
 * @Description TODO
 * @Author davidt
 * @Date 9/7/2020 3:53 PM
 * @Version 1.0
 **/
@RestController
public class OrderController {
    @Value("${service-url.nacos-user-service}")
    private String SERVICE_URL;

    @Resource
    private RestTemplate restTemplate;

    @GetMapping("/consumer/getResourceById/{id}")
    @SentinelResource(value = "fallback", fallback = "handlerFallback", blockHandler = "blockHandler")
    public CommonResult getResourceById(@PathVariable("id") Long id) {
        CommonResult result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/" + id, CommonResult.class, id);
        if (result.getData() == null) {
            throw new NullPointerException("没有 对应的 ID 记录");
        }
        return result;
    }

    public CommonResult handlerFallback(@PathVariable("id") Long id, Throwable exception) {
        return new CommonResult(444, "id= " + id + ",\t异常 Handler 方法: " + exception.getMessage());
    }

    public CommonResult blockHandler(@PathVariable("id") Long id, BlockException exception) {
        return new CommonResult(44544, "id= " + id + ",\t异常 Handler 方法: " + exception.getMessage());
    }
}

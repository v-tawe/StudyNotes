package com.tawe.springcloudalibaba.handler;

import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.tawe.springcloud.entities.CommonResult;

/**
 * @ClassName CustomerBlockHandler
 * @Description TODO
 * @Author davidt
 * @Date 9/7/2020 2:40 PM
 * @Version 1.0
 **/

public class CustomerBlockHandler {
    public static CommonResult handleException(BlockException exception) {
        return new CommonResult(4444, "用户自定义 Handler: " + exception.getClass().getCanonicalName() + "\t 服務不可用");
    }
}

package com.kyss.dubbo.demo.provider;

import com.kyss.dubbo.demo.DemoService;

/**
 * @ClassName DemoServiceImpl
 * @Description TODO
 * @Author davidt
 * @Date 7/22/2020 3:39 PM
 * @Version 1.0
 **/
public class DemoServiceImpl implements DemoService {
    @Override
    public String sayHello(String name) {
        return "Hello " + name;
    }
}

package com.kyss.demo.service.provider;

import com.kyss.demo.service.DemoService;

/**
 * @ClassName DemoServiceImpl
 * @Description TODO
 * @Author davidt
 * @Date 7/22/2020 3:06 PM
 * @Version 1.0
 **/
public class DemoServiceImpl implements DemoService {

    @Override
    public String sayHello(String name) {
        return "Hello " + name;
    }
}

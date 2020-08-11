package com.kyss.demo.app;

import com.kyss.demo.service.DemoService;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * @ClassName Consumer
 * @Description TODO
 * @Author davidt
 * @Date 7/22/2020 3:17 PM
 * @Version 1.0
 **/
public class Consumer {
    public static void main(String[] args) {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("classpath:consumer.xml");
        context.start();
        DemoService demo = (DemoService) context.getBean("demoService");
        String world = demo.sayHello("world");
        System.out.println(world);
    }
}

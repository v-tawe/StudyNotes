package com.kyss.demo.app;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;

/**
 * @ClassName Provider
 * @Description TODO
 * @Author davidt
 * @Date 7/22/2020 3:12 PM
 * @Version 1.0
 **/
public class Provider {
    public static void main(String[] args) throws IOException {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("classpath:provider.xml");
        context.start();
        System.in.read();

    }
}

package com.tawe.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * @ClassName OrderMain8082
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 2:11 PM
 * @Version 1.0
 **/
@SpringBootApplication
@EnableFeignClients
public class OrderMain8082 {
    public static void main(String[] args) {
        SpringApplication.run(OrderMain8082.class, args);
    }
}

package com.tawe.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

/**
 * @ClassName OrderMain80
 * @Description TODO
 * @Author davidt
 * @Date 8/20/2020 10:14 AM
 * @Version 1.0
 **/
@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient
public class OrderMain8080 {

    public static void main(String[] args) {
        SpringApplication.run(OrderMain8080.class, args);
    }
}

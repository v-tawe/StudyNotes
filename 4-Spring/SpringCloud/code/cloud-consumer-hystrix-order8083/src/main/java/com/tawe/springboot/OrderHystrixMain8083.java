package com.tawe.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * @ClassName OrderHystrixMain8083
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 4:37 PM
 * @Version 1.0
 **/
@SpringBootApplication
@EnableFeignClients
@EnableHystrix
public class OrderHystrixMain8083 {
    public static void main(String[] args) {
        SpringApplication.run(OrderHystrixMain8083.class, args);
    }
}

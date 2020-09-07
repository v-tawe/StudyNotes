package com.tawe.springcloudalibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * @ClassName ComsumerMain83
 * @Description TODO
 * @Author davidt
 * @Date 9/1/2020 5:52 PM
 * @Version 1.0
 **/

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class ComsumerMain83 {
    public static void main(String[] args) {
        SpringApplication.run(ComsumerMain83.class, args);
    }
}

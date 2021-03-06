package com.tawe.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

/**
 * @ClassName com.tawe.springcloud.PaymentMain8001
 * @Description TODO
 * @Author davidt
 * @Date 8/19/2020 5:39 PM
 * @Version 1.0
 **/

@SpringBootApplication
@EnableEurekaClient
@EnableCircuitBreaker
public class PaymentMain8001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8001.class, args);
    }
}

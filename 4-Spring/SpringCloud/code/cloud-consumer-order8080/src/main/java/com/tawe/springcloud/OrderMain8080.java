package com.tawe.springcloud;

import com.tawe.myrule.MyRule;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.ribbon.RibbonClient;

/**
 * @ClassName OrderMain80
 * @Description TODO
 * @Author davidt
 * @Date 8/20/2020 10:14 AM
 * @Version 1.0
 **/
@SpringBootApplication
@EnableDiscoveryClient
@RibbonClient(name = "cloud-payment-service", configuration = MyRule.class)
public class OrderMain8080 {

    public static void main(String[] args) {
        SpringApplication.run(OrderMain8080.class, args);
    }
}

package com.tawe.springcloudalibaba;

/**
 * @ClassName NacosProviderMain9001
 * @Description TODO
 * @Author davidt
 * @Date 9/1/2020 5:45 PM
 * @Version 1.0
 **/

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class NacosProviderMain9001 {
    public static void main(String[] args) {
        SpringApplication.run(NacosProviderMain9001.class, args);
    }
}

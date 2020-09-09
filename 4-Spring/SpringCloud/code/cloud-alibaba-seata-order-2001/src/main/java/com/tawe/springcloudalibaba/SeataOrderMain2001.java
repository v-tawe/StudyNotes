package com.tawe.springcloudalibaba;

/**
 * @ClassName SeataOrderMain2001
 * @Description TODO
 * @Author davidt
 * @Date 9/8/2020 1:27 PM
 * @Version 1.0
 **/

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

//@SpringBootApplication(exclude = DataSourceAutoConfiguration.class) // 取消数据源的自动创建，使用 seata 代理
@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
//@EnableAutoDataSourceProxy
public class SeataOrderMain2001 {
    public static void main(String[] args) {
        SpringApplication.run(SeataOrderMain2001.class, args);
    }
}

package com.tawe.springcloud.mylb;

import org.springframework.cloud.client.ServiceInstance;

import java.util.List;

/**
 * @ClassName LoadBalancer
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 1:31 PM
 * @Version 1.0
 **/
public interface LoadBalancer {
    ServiceInstance getInstance(List<ServiceInstance> serviceInstances);
}

package com.tawe.springcloud.mylb;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @ClassName MyLB
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 1:32 PM
 * @Version 1.0
 **/
@Component
public class MyLB implements LoadBalancer {

    private AtomicInteger atomicInteger = new AtomicInteger(0);

    public final int getAndIncrement() {
        int cur;
        int next;

        for(;;) {
            cur = this.atomicInteger.get();
            next = cur >= Integer.MAX_VALUE ? 0 : cur + 1;

            if (this.atomicInteger.compareAndSet(cur, next)) {
                return next;
            }
        }
    }

    @Override
    public ServiceInstance getInstance(List<ServiceInstance> serviceInstances) {

        int index = getAndIncrement() % serviceInstances.size();
        return serviceInstances.get(index);
    }
}

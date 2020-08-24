package com.tawe.springcloud.controller;

import com.netflix.discovery.shared.Applications;
import com.tawe.springcloud.entities.CommonResult;
import com.tawe.springcloud.entities.Payment;
import com.tawe.springcloud.mylb.LoadBalancer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @ClassName OrderController
 * @Description TODO
 * @Author davidt
 * @Date 8/20/2020 10:11 AM
 * @Version 1.0
 **/
@RestController
@Slf4j
public class OrderController {

    @Autowired
    private RestTemplate restTemplate;

    // eureka - 单机版
//    private static final String PAYMENT_URL = "http://localhost:8001";

    // eureka - 集群
    private static final String PAYMENT_URL = "http://CLOUD-PAYMENT-SERVICE";

    // consul - 单机
    public static final String CONSUL_PAYMENT_URL = "http://consul-provider-payment";

    @Resource
    private DiscoveryClient discoveryClient;

    @Resource
    private LoadBalancer loadbalancer;

    @GetMapping("/consumer/payment/create")
    public CommonResult create(Payment payment) {
        log.info("********consumer 插入数据：{} *********", payment);
        return restTemplate.postForObject(PAYMENT_URL + "/payment/create", payment, CommonResult.class);
    }

    @GetMapping("/consumer/payment/get/{id}")
    public CommonResult getPayment(@PathVariable("id") Long id) {
        log.info("******** consumer 查询数据 *********");
        return restTemplate.getForObject(PAYMENT_URL + "/payment/get/" + id, CommonResult.class);
    }

    @GetMapping("/consumer/discovery")
    public CommonResult discovery() {
        List<String> services = discoveryClient.getServices();
        CommonResult<Object> commonResult = new CommonResult<>();
        HashMap<String, HashMap> ResultMap = new HashMap();
        commonResult.setCode(200);
        commonResult.setMessage("***** 发现服务 ******");
        commonResult.setData(ResultMap);

        discoveryClient.getServices().forEach(service -> {
            log.info("*****" + service);

            // 保存 service 的信息
            HashMap<String, ArrayList<HashMap<String, String>>> serviceMap = new HashMap();
            ResultMap.put(service, serviceMap);
            ArrayList<HashMap<String, String>> instancesList = new ArrayList();

            // 发现 instance 的信息
            List<ServiceInstance> instances = discoveryClient.getInstances(service);
            instances.forEach(instance -> {
                serviceMap.put(instance.getServiceId(), instancesList);
                HashMap<String, String> instanceMap = new HashMap<>();
                instancesList.add(instanceMap);
                log.info("*****" + instance.getInstanceId() + " " + instance.getHost() + " " + instance.getUri() + " "
                        + instance.getPort());
                instanceMap.put("InstanceId", instance.getInstanceId());
                instanceMap.put("Host", instance.getHost());
                instanceMap.put("Uri", instance.getUri().toString());
                instanceMap.put("Port", String.valueOf(instance.getPort()));
            });

        });

        return commonResult;
    }

    // 无法同时使用两个 注册中心 会报错
    // Field registration in org.springframework.cloud.client.serviceregistry
    // .ServiceRegistryAutoConfiguration$ServiceRegistryEndpointConfiguration required a single bean, but 2 were found:
    //	- eurekaRegistration: defined in BeanDefinition defined in class path resource
    //	[org/springframework/cloud/netflix/eureka/EurekaClientAutoConfiguration$RefreshableEurekaClientConfiguration
    //	.class]
    //	- consulRegistration: defined by method 'consulRegistration' in class path resource
    //	[org/springframework/cloud/consul/serviceregistry/ConsulAutoServiceRegistrationAutoConfiguration.class]

//    @GetMapping("/consumer/consul/discovery")
//    public CommonResult consulDiscovery() {
//        return restTemplate.getForObject(CONSUL_PAYMENT_URL + "/payment/consul", CommonResult.class);
//    }


    @GetMapping("/consumer/payment/lb")
    public String getPaymentLB() {
        List<ServiceInstance> instances = discoveryClient.getInstances("cloud-payment-service");

        if (instances == null || instances.size() <= 0) {
            return null;
        }

        ServiceInstance serviceInstance = loadbalancer.getInstance(instances);
        return restTemplate.getForObject(serviceInstance.getUri() + "/payment/lb", String.class);
    }
}

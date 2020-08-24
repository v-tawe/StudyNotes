package com.tawe.myrule;

import com.netflix.loadbalancer.IRule;
import com.netflix.loadbalancer.RandomRule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @ClassName MyRule
 * @Description TODO
 * @Author davidt
 * @Date 8/24/2020 10:59 AM
 * @Version 1.0
 **/
@Configuration
public class MyRule {
    @Bean
    public IRule myRule() {
        return new RandomRule();
    }
}

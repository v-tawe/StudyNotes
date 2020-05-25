package com.mybatis.springboot;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanNameGenerator;
import org.springframework.util.ClassUtils;

import java.beans.Introspector;
import java.util.HashMap;
import java.util.Map;

/**
 * @ClassName MapperNameGenerator
 * @Description TODO
 * @Author davidt
 * @Date 5/22/2020 10:14 AM
 * @Version 1.0
 **/
public class MapperNameGenerator implements BeanNameGenerator {
    Map<String, Integer> nameMap = new HashMap<>();

    @Override
    public String generateBeanName(BeanDefinition definition, BeanDefinitionRegistry registry) {
        String shortClassName = ClassUtils.getShortName(definition.getBeanClassName());
        String beanName = Introspector.decapitalize(shortClassName);
        if (nameMap.containsKey(beanName)) {
            int index = nameMap.get(beanName) + 1;
            nameMap.put(beanName, index);
            beanName += index;
        } else {
            nameMap.put(beanName, 1);
        }
        return beanName;
    }
}

package com.tawe.springcloud.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @ClassName Payment
 * @Description TODO
 * @Author davidt
 * @Date 8/19/2020 6:10 PM
 * @Version 1.0
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    private Long id;
    private String serial;
}

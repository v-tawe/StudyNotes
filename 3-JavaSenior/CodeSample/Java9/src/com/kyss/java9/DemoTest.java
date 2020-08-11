package com.kyss.java9;

import com.kyss.demo.IDemo;
import org.junit.jupiter.api.Test;

/**
 * @ClassName com.kyss.java9.DemoTest
 * @Description TODO
 * @Author davidt
 * @Date 7/14/2020 3:11 PM
 * @Version 1.0
 **/
public class DemoTest implements IDemo {
    @Override
    public void demo() {

    }

    @Test
    public void test() {
        System.out.println("com.kyss.java9.DemoTest.test");
    }
}

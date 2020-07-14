package com.kyss.demo;

/**
 * @ClassName com.kyss.demo.DemoTest
 * @Description TODO
 * @Author davidt
 * @Date 7/14/2020 3:04 PM
 * @Version 1.0
 **/
public class DemoTest implements IDemo{

    @Override
    public void demo() {
        System.out.println("com.kyss.demo.DemoTest.demo");
    }

    public static void main(String[] args) {
        DemoTest demoTest = new DemoTest();
        demoTest.demo();
        demoTest.show();
        IDemo demoTest2 = demoTest;
        demoTest2.demo();
//        demoTest2.show2();
        IDemo.display();
//        com.kyss.demo.IDemo.main();
    }
}


package com.kyss.demo;

public interface IDemo {
    default void show() {
        System.out.println("com.kyss.demo.IDemo.show");
    }

    private void show2() {
        System.out.println("com.kyss.demo.IDemo.show2");
    }

    static void display() {
        System.out.println("com.kyss.demo.IDemo.display");
    }

    private static void main() {
        System.out.println("com.kyss.demo.IDemo.main");
    }

    void demo();
}

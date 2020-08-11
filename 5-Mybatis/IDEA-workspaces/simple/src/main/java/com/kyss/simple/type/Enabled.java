package com.kyss.simple.type;

/**
 * @ClassName Enabled
 * @Description TODO
 * @Author davidt
 * @Date 5/14/2020 3:59 PM
 * @Version 1.0
 **/
public enum Enabled {
//    disables,
//    enabled;
    enabled(1),
    disabled(0);

    private final int value;

    private Enabled(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}

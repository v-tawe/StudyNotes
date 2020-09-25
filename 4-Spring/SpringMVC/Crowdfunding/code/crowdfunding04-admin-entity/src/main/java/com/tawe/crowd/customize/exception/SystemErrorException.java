package com.tawe.crowd.customize.exception;

/**
 * @ClassName SystemErrorException
 * @Description TODO
 * @Author Administrator
 * @Date 9/25/2020 10:37 AM
 * @Version 1.0
 **/
public class SystemErrorException extends Exception {
    public SystemErrorException(String message) {
        super(message);
    }

    public SystemErrorException() {
        super();
    }
}

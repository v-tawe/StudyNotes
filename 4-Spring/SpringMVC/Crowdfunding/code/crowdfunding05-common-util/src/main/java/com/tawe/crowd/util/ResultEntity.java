package com.tawe.crowd.util;

/**
 * @ClassName ResultEntity
 * @Description 用于统一项目中前后端之间的数据格式
 * @Author Administrator
 * @Date 9/24/2020 4:12 PM
 * @Version 1.0
 **/
public class ResultEntity<T> {
    public static final String SUCCESS = "SUCCESS";
    public static final String FAILURE = "FAILURE";
    public static final String NO_MESSAGE = "NO_MESSAGE";

    private String result;
    private String message;
    private T data;


    public static <E> ResultEntity<E> succeededWithoutData() {
        return new ResultEntity<>(SUCCESS, NO_MESSAGE, null);
    }

    public static <E> ResultEntity<E> succeededWithData(E data) {
        return new ResultEntity<>(SUCCESS, NO_MESSAGE, data);
    }

    public static <E> ResultEntity<E> failed(String message) {
        return new ResultEntity<>(FAILURE, message, null);

    }

    public ResultEntity() {
    }

    public ResultEntity(String result, String message, T data) {
        this.result = result;
        this.message = message;
        this.data = data;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "ResultEntity{" +
                "result='" + result + '\'' +
                ", message='" + message + '\'' +
                ", data=" + data +
                '}';
    }
}

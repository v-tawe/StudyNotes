package com.tawe.crowd.util;

import javax.servlet.http.HttpServletRequest;

/**
 * @ClassName CrowdUtil
 * @Description TODO
 * @Author Administrator
 * @Date 9/24/2020 4:57 PM
 * @Version 1.0
 **/
public class CrowdUtil {
    public static boolean judgeRequestType(HttpServletRequest request) {

        // 1. 获取请求头消息
        String accept = request.getHeader("Accept");
        String xRequest = request.getHeader(("X-Requested-With"));

        // 2. 检查并返回
        return (accept != null && accept.length() > 0 && accept.contains("application/json") ||
                xRequest != null && xRequest.length() > 0 && "XMLHttpRequest".equals(xRequest));

    }
}

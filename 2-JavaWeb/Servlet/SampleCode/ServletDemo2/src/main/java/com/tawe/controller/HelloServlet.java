package com.tawe.controller;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * @ClassName com.tawe.controller.HelloController
 * @Description TODO
 * @Author davidt
 * @Date 8/5/2020 4:39 PM
 * @Version 1.0
 **/
public class HelloServlet implements Servlet {
    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        System.out.println("com.tawe.controller.HelloController.init");
    }

    @Override
    public ServletConfig getServletConfig() {
        return null;
    }

    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
        System.out.println("com.tawe.controller.HelloController.service");
        AsyncContext asyncContext;
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        request.setAttribute("name", "hello");

        HttpServletResponse response = (HttpServletResponse) servletResponse;
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.println("你好，中国！");

        // 转发请求
//        RequestDispatcher requestDispatcher = request.getRequestDispatcher("\\hello2");
//        requestDispatcher.forward(request, response);

        // 重定向请求 - 1
//        response.setStatus(302);
//        response.setHeader("Location", "classpath:\\hello2");

        // 重定向请求 - 2
        response.sendRedirect("classpath:\\hello2");
    }

    @Override
    public String getServletInfo() {
        return null;
    }

    @Override
    public void destroy() {
        System.out.println("com.tawe.controller.HelloController.destroy");
    }
}

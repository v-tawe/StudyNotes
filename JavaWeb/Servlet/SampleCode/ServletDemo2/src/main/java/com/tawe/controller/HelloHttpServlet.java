package com.tawe.controller;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;

/**
 * @ClassName HelloHttpServlet
 * @Description TODO
 * @Author davidt
 * @Date 8/5/2020 4:50 PM
 * @Version 1.0
 **/
public class HelloHttpServlet extends HttpServlet {

    @Override
    public ServletConfig getServletConfig() {
//        System.out.println("HelloHttpServlet.getServletConfig");
        return super.getServletConfig();
    }

    @Override
    public ServletContext getServletContext() {
        System.out.println("HelloHttpServlet.getServletContext");
        return super.getServletContext();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletContext servletContext = req.getServletContext();
        ServletContext servletContext1 = getServletContext();
        System.out.println(servletContext.getContextPath());
        System.out.println(servletContext1.getRealPath("/"));

        System.out.println("================================");

        ServletConfig servletConfig = getServletConfig();
        Enumeration<String> initParameterNames = servletConfig.getInitParameterNames();
        while(initParameterNames.hasMoreElements()) {
            String index = initParameterNames.nextElement();
            System.out.println(index + " : " + servletConfig.getInitParameter(index));
        }

        System.out.println("================================");

        System.out.println(servletContext.getInitParameter("baseContext"));

        System.out.println("================================");

        Enumeration<String> initParameterNames1 = getInitParameterNames();
        while(initParameterNames1.hasMoreElements()) {
            String index = initParameterNames1.nextElement();

            System.out.println(index + " : " + getInitParameter(index));
        }


    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    }
}

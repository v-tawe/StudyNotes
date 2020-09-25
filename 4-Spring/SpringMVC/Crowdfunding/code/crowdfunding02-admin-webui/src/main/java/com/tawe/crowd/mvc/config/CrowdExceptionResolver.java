package com.tawe.crowd.mvc.config;

import com.google.gson.Gson;
import com.tawe.crowd.constant.CrowdConstant;
import com.tawe.crowd.customize.exception.LoginFailedException;
import com.tawe.crowd.customize.exception.SystemErrorException;
import com.tawe.crowd.util.CrowdUtil;
import com.tawe.crowd.util.ResultEntity;
import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.rmi.MarshalledObject;

/**
 * @ClassName CrowdExceptionResolver
 * @Description TODO
 * @Author Administrator
 * @Date 9/24/2020 5:36 PM
 * @Version 1.0
 **/
@ControllerAdvice
public class CrowdExceptionResolver {

    @ExceptionHandler(LoginFailedException.class)
    public ModelAndView resolveLoginFailedException(LoginFailedException e, HttpServletRequest request, HttpServletResponse response) throws IOException {
        String viewName = "admin-login";
        return resolveException(e, request, response, viewName);
    }

    @ExceptionHandler(SystemErrorException.class)
    public ModelAndView resolveSystemErrorException(LoginFailedException e, HttpServletRequest request, HttpServletResponse response) throws IOException {
        String viewName = "system-error";
        return resolveException(e, request, response, viewName);
    }

    /**
     * 核心异常处理方法
     * @param e SpringMVC 捕获到的异常
     * @param request 当前请求对象
     * @param response 当前响应对象
     * @param viewName 返回的视图名称
     * @return ModelAndView
     */
    public ModelAndView resolveException(Exception e, HttpServletRequest request, HttpServletResponse response, String viewName) throws IOException {
        // 1. 判断当前请求是 "普通请求" 还是 "Ajax请求"
        boolean judgeResult = CrowdUtil.judgeRequestType(request);

        // 2. 如果是 Ajax 请求
        if(judgeResult) {
            // 3. 从当前异常对象中获取异常信息
            String message = e.getMessage();

            // 4. 创建 ResultEntity
            ResultEntity<Object> failed = ResultEntity.failed(message);

            // 5. 创建 Gson 对象
            Gson gson = new Gson();

            // 6. 将 resultEntity 转换为 JSON 对象
            String json = gson.toJson(failed);

            // 7. 把当前 JSON 字符串作为当前请求的响应体数据返回给浏览器
            // 7.1 获取 Writer 对象
            PrintWriter writer = response.getWriter();

            // 7.2 写入数据
            writer.write(json);

            // 8. 返回 null, 不给 SpringMVC 提供 ModelAndView 对象
            // 这样 SpringMVC 就知道不需要框架解析视图提供响应
            return null;
        }
        // 9. 创建 ModelAndView 对象
        ModelAndView modelAndView = new ModelAndView();

        // 10. 将 Exception 对象存入模型
        modelAndView.addObject(CrowdConstant.ATTR_NAME_EXCEPTION.toString(), e);

        // 11. 设置目标视图名称
        modelAndView.setViewName(viewName);

        // 12. 返回 ModelAndView 对象
        return modelAndView;
    }
}

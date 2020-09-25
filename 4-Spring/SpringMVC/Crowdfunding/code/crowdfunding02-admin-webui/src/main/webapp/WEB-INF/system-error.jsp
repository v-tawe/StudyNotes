<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 9/24/2020
  Time: 5:20 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Error</title>
    <script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery-2.1.1.min.js"></script>
    <script type="text/css" src="${pageContext.request.contextPath}/bootstrap/css/bootstrap.min.css"></script>
    <script type="text/javascript">
        $(function () {
            $("button").click(function () {
                // 调用 back() 方法类似于点击浏览器后退的按钮
                window.history.back();
            });
        });
    </script>
</head>
<body>
<div class="container" style="text-align: center">
    <h3>系统信息页面</h3>
    <h4>${pageContext.exception.message}</h4>
    <button style="width: 300px; margin: 0 auto 0 auto;" class="btn btn-lg btn-success btn-block">返回上一页</button>
</div>
</body>
</html>

<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>Index</title>
    <%--http://localhost:8080/<project_name>/<resource_name>.html--%>
    <base href="http://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.request.contextPath}/"/>
    <script type="text/javascript" src="jquery/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="layer/js/layerjs.js"></script>
    <script type="text/css" src="bootstrap/css/bootstrap.min.css"></script>
    <%--<script src="https://keycdn.layerjs.org/libs/layerjs/layerjs-0.6.4.min.js"></script>--%>
    <%--<link href="https://keycdn.layerjs.org/libs/layerjs/layerjs-0.6.4.css" type="text/css" rel="stylesheet" />--%>
    <script type="text/javascript">
        // 将 JSON 数组转换为 JSON 字符串
        let array = [1, 10, 20];
        let arrayStr = JSON.stringify(array);
        $(function () {
            layer.msg("heello");
            $("#testAjax").click(function () {
                let id=JSON.stringify({"id":1});
                $.ajax({
                    url: "test/ajax.json",
                    type: "post",
                    // 单独 id 请求
                    // data: {
                    //     id: 1
                    // },
                    data: arrayStr,
                    contentType: "application/json;charset=UTF-8",
                    success: function (response) {
                        alert(response.data);
                        // layer.msg(response.data);
                    },
                    error: function (error) {
                        alert(error.message);
                        // layer.msg(error.data);
                    }
                });
            });
        });
    </script>
</head>
<body>
<h2>Hello World!</h2>
<a href="test/ssm.html">测试 SSM 整合环境</a><br/>
<a href="test/login_exception.html">测试 login exception</a><br/>
<button id="testAjax">testAjax</button><br/>
<a href="test/sys_exception.html">测试 system error 页面</a><br/>

</body>
</html>

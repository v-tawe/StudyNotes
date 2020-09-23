<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>Index</title>
    <%--http://localhost:8080/<project_name>/<resource_name>.html--%>
    <base href="http://${pageContext.request.serverName }:${pageContext.request.serverPort }${pageContext.request.contextPath }/"/>
    <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
    <%--<script type="text/javascript" src="jquery/jquery-2.1.1.min.js"></script>--%>
    <script type="text/javascript">
        $(function () {
            $("#testAjax").click(function () {
                let id=JSON.stringify({"id":1});
                $.ajax({
                    url: "test/ajax.json",
                    type: "post",
                    // 单独 id 请求
                    // data: {
                    //     id: 1
                    // },
                    data: id,
                    contentType: "application/json;charset=UTF-8",
                    success: function (data) {
                        alert(data);
                    },
                    error: function (error) {
                        alert(error);
                    }
                })
            })
        })
    </script>
</head>
<body>
<h2>Hello World!</h2>
<a href="/${pageContext.request.contextPath }/test/ssm.html">测试 SSM 整合环境</a>
<button id="testAjax" value="testAjax">testAjax</button>
</body>
</html>

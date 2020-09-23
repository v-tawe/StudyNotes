<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>测试</h1>
    ${requestScope.get("admins")}
</body>
</html>
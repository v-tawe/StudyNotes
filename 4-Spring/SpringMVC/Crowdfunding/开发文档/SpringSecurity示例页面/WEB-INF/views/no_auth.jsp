<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	pageContext.setAttribute("PATH", request.getContextPath());
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1">
<title>武林秘籍管理系统</title>
<link rel="stylesheet" href="${PATH }/layui/css/layui.css">
</head> 
<body class="layui-layout-body">
	<div class="layui-layout layui-layout-admin">
		<!-- 顶部导航 -->
		<%@include file="/WEB-INF/include/navbar.jsp" %>
		
		<!-- 侧边栏 -->
		<%@include file="/WEB-INF/include/sidebar.jsp" %>
		
		
		<div class="layui-body">
			<!-- 内容主体区域 -->
			<div style="padding: 15px;">
				<h1>非常抱歉！您没有访问这个功能的权限！（回家照照镜子）</h1>
				<h2>${message }</h2>
			</div>
		</div>
		<div class="layui-footer"></div>
	</div>
	<script src="${PATH }/layui/layui.js"></script>
	<script>
		//JavaScript代码区域
		layui.use('element', function() {
			var element = layui.element;

		});
	</script>
</body>
</html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	pageContext.setAttribute("PATH", request.getContextPath());
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>登入 - layuiAdmin</title>
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
<link rel="stylesheet" href="${PATH }/layui/css/layui.css">
<link rel="stylesheet" href="${PATH }/layui/css/admin.css">
<link rel="stylesheet" href="${PATH }/layui/css/all.css">
</head>
<body>
	
		<div class="layadmin-user-login layadmin-user-display-show"
			id="LAY-user-login" style="display: none;">
	
			<div class="layadmin-user-login-main">
				<div class="layadmin-user-login-box layadmin-user-login-header">
					<h2>layuiAdmin</h2>
					<p>layui 官方出品的单页面后台管理模板系统</p>
				</div>
				<div
					class="layadmin-user-login-box layadmin-user-login-body layui-form">
						
						<div class="layui-form-item">
							
							<label
								class="layadmin-user-login-icon layui-icon layui-icon-username"
								for="LAY-user-login-username"></label> 
							
							<!-- input的name属性值必须符合SpringSecurity规则，除非专门进行了定制，否则用户名必须使用username，密码必须使用password -->
							<input type="text"
								name="loginacct" id="LAY-user-login-username" lay-verify="required"
								placeholder="用户名" class="layui-input">
						</div>
						<div class="layui-form-item">
							<label
								class="layadmin-user-login-icon layui-icon layui-icon-password"
								for="LAY-user-login-password"></label> <input type="text"
								name="credential" id="LAY-user-login-password" lay-verify="required"
								placeholder="密码" class="layui-input">
						</div>
						<div class="layui-form-item">
							<div class="layui-row">
								<div class="layui-col-xs7">
									<label
										class="layadmin-user-login-icon layui-icon layui-icon-vercode"
										for="LAY-user-login-vercode"></label> <input type="text"
										name="vercode" id="LAY-user-login-vercode" lay-verify="required"
										placeholder="图形验证码" class="layui-input">
								</div>
								<div class="layui-col-xs5">
									<div style="margin-left: 10px;">
										<img src="https://www.oschina.net/action/user/captcha"
											class="layadmin-user-login-codeimg" id="LAY-user-get-vercode">
									</div>
								</div>
							</div>
						</div>
						<div class="layui-form-item" style="margin-bottom: 20px;">
							<input type="checkbox" name="remember-me" lay-skin="primary"
								title="记住我"> <a href="forget.html"
								class="layadmin-user-jump-change layadmin-link"
								style="margin-top: 7px;">忘记密码？</a>
						</div>
						<div class="layui-form-item">
							<button type="submit" class="layui-btn layui-btn-fluid" lay-submit
								lay-filter="LAY-user-login-submit">登 入</button>
						</div>
						<div class="layui-trans layui-form-item layadmin-user-login-other">
							<label>社交账号登入</label> <a href="javascript:;"><i
								class="layui-icon layui-icon-login-qq"></i></a> <a href="javascript:;"><i
								class="layui-icon layui-icon-login-wechat"></i></a> <a
								href="javascript:;"><i
								class="layui-icon layui-icon-login-weibo"></i></a> <a href="reg.html"
								class="layadmin-user-jump-change layadmin-link">注册帐号</a>
						</div>
				</div>
			</div>
	
			<div class="layui-trans layadmin-user-login-footer">
				<p>
					© 2018 <a href="http://www.layui.com/" target="_blank">layui.com</a>
				</p>
			</div>
	
		</div>

	<script src="${PATH }/layui/layui.js"></script>
	<script>
		layui.use([ 'element', 'form' ], function() {
			var element = layui.element, form = layui.form, layer = layui.layer ;
			form.render();
			
			//提交
			form.on('submit(LAY-user-login-submit)', function(obj) {
				obj.elem.classList.add("layui-btn-disabled");//样式上的禁用效果
				obj.elem.disabled = true;//真正的禁用效果
				layer.msg("登陆成功，即将跳转");
				setTimeout(function(){
					location.href="main.html";
				}, 2000);
			});

		});
	</script>
</body>
</html>
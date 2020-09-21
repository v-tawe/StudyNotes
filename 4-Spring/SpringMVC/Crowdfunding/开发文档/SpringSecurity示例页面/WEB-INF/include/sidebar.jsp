<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<div class="layui-side layui-bg-black">
	<div class="layui-side-scroll">
		<!-- 左侧导航区域（可配合layui已有的垂直导航） -->
		<ul class="layui-nav layui-nav-tree" lay-filter="test">
			<li class="layui-nav-item"><a class=""
				href="javascript:;">普通武功秘籍</a>
				<dl class="layui-nav-child">
					<dd>
						<a href="${PATH }/level1/1">罗汉拳</a>
					</dd>
					<dd>
						<a href="${PATH }/level1/2">武当长拳</a>
					</dd>
					<dd>
						<a href="${PATH }/level1/3">全真剑法</a>
					</dd>
				</dl></li>
			<li class="layui-nav-item"><a href="javascript:;">高级武功秘籍</a>
				<dl class="layui-nav-child">
					<dd>
						<a href="${PATH }/level2/1">太极拳</a>
					</dd>
					<dd>
						<a href="${PATH }/level2/2">七伤拳</a>
					</dd>
					<dd>
						<a href="${PATH }/level2/3">梯云纵</a>
					</dd>
				</dl></li>
			<li class="layui-nav-item"><a href="javascript:;">绝世武功秘籍</a>
				<dl class="layui-nav-child">
					<dd>
						<a href="${PATH }/level3/1">葵花宝典</a>
					</dd>
					<dd>
						<a href="${PATH }/level3/2">龟派气功</a>
					</dd>
					<dd>
						<a href="${PATH }/level3/3">独孤九剑</a>
					</dd>
				</dl></li>
			<li class="layui-nav-item"><a href="#">华山论剑</a></li>
		</ul>
	</div>
</div>

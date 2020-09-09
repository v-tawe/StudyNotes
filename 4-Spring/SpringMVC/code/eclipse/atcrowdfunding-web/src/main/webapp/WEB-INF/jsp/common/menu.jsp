<%@page pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<ul style="padding-left:0px;" class="list-group">
    <c:forEach items="${rootPermission.children}" var="permission">
        <c:if test="${empty permission.children}">
			<li class="list-group-item tree-closed" >
				<a href="${APP_PATH}${permission.url}"><i class="${permission.icon}"></i> ${permission.name}</a> 
			</li>        
        </c:if>
        <c:if test="${not empty permission.children}">
			<li class="list-group-item tree-closed">
				<span><i class="${permission.icon}"></i> ${permission.name} <span class="badge" style="float:right">${permission.children.size()}</span></span> 
				<ul style="margin-top:10px;display:none;">
					<c:forEach items="${permission.children}" var="child">
					<li style="height:30px;">
						<a href="${APP_PATH}${child.url}"><i class="${child.icon}"></i> ${child.name}</a> 
					</li>
					</c:forEach>
				</ul>
			</li>
        </c:if>
    </c:forEach>
</ul>
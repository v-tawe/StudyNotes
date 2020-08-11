# Shiro

## Shiro 简介

- Authentication 身份认证/登录
- Authorization 授权
- Session Manager 会话管理
- Cryptography 加密
- Caching 缓存
- Remember Me 记住我
- Run As 允许用户以另一用户身份访问

## Authentication

Shiro 认证基本流程：
Application -> Subject -> SecurityManager -> Realm

- Subject - 当前“用户”
- SecurityManager - Shiro 核心，负责与 Shiro 的其他组件交互 - 相当于 Spring MVC 中的 DispatcherServlet
- Realm - Shiro 从 Realm 获取安全数据

SecurityManager 需要验证用户身份，它需要从 Realm 获取相应的用户进行比较 确认用户身份是否合法；也需要从 Realm 得到用户相应的角色进行验证用户是否有权限进行操作。

### 身份验证

- principals: 主体的标识属性 - 用户名、邮箱等，唯一即可
- credentials: 证明/凭证 - 密码

### Web 集成/Spring 集成

ShiroFilter 进行 URL 拦截, URL 匹配模式采用 Ant 风格：

- \? - 匹配一个字符
- \* - 匹配零个或多个字符
- \*\* - 匹配零个或多个路径

> NOTE
> URL 权限采取第一次匹配优先原则，及生效最先定义的 URL 匹配。

#### 基本步骤

1. 收集用户身份/凭证 - 用户名/密码
1. 调用 `Subject.login` 进行登录，自动委托给 SecurityManager
1. `SecurityManager` 负责身份验证逻辑，委托 `Authenticator` 进行身份认证
1. `Authenticator` 委托 `AuthenticationStrategy` 进行多 Realm 身份验证
1. `Authenticator` 讲相应的 token 传入 Realm，从 Realm 获取身份验证信息进行验证
1. 创建自定义的 Realm 类，继承 `org.apache.shiro.realm.AuthorizingRealm` 类，实现 `doGetAuthenticationInfo(AuthenticationToken)` 方法

### 使用步骤

1. 获取当前 Subject， 调用 `SecurityUtils.getSubject()`;
1. 测试当前得用户是否已经被认证，调用 `subject.isAuthenticated()`;
1. 若没有被认证，则把用户名和密码封装到 `UsernamePasswordToken` 对象;
   1. 创建一个表单页面；
   1. 提交请求到 SpringMVC 的 Handler；
   1. 获取用户名、密码
1. 执行登录，调用 `subject.login(AuthenticationToken)` 方法;
1. 自定义 Realm 方法，从数据库中获取对应的记录 ，返回给 Shiro;
   1. 继承 `org.apache.shiro.realm.AuthorizingRealm` 类；
   1. 实现 `doGetAuthenticationInfo(AuthenticationToken)` 方法；
1. 由 shiro 完成密码的验证；
   1. 通过 `AuthenticatingRealm` 的 `credentialsMatcher` 进行比对；

## Authorizaton

- Subject - 当前“用户”
- Resource - 资源，Web 应用中代表 URL
- Permission - 权限
- Role - 权限的集合

### 基本步骤

1. 调用 `Subject.isPermitted*/hasRole*` 接口，自动委托给 `SecurityManager`
1. `SecurityManager` 委托给 `Authorizer` 进行验证, 根据请求 `Authorizer.isPermitted("user:permission")`，返回 `Permission` 实例
1. 在授权前，调用 Realm 获取 subject 相关的 角色/权限，验证权限是否匹配；
1. `ModularRealmAuthorizer` 进行多 Realm 匹配流程；

### 权限注解

- `@RequiresAuthentication` - authc 需要身份验证
- `@RequiresUser` - user 需要身份验证或记住我
- `@RequiresGuest` - anon 可以匿名访问
- `@RequiresRoles({"admin","user"})` - roles 需要 admin or/and user 角色
- `@RequiresPermissions({"user:a", "user:b"})` - perms - 需要 user:a or/and user:b 权限

## Session

Shiro Session 可以访问 Web 应用 `HttpServletSession` 的数据；

SessionDao 

## Cache

实现 `CacheManagerAware` 接口，将会自动注入 `CacheManger`；

## RememberMe

- `subject.isAuthenticated()` - 通过 身份认证 登录
- `subject.isRemembered()`  - 通过 记住我 登录

两者不可都为 `true`;

要实现 RememberMe， 在创建 Token 前调用 `token.setRememberMe(true);` 进行设置
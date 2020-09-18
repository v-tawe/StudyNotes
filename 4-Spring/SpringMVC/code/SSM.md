# SSM 搭建步骤

本文详细说明下搭建 SSM Spring + SpringMVC + MyBatis 的搭建步骤：

主要涉及文件：

- webapp/WEB-INF/web.xml
- resource/spring/spring-config.xml
- resource/spring/springmvc-config.xml
- resource/mybatis/mybatis-config.xml
- resource/jdbc.properties
- resource/log4j.properties

## web.xml

1. 配置 Spring Configuration，启动 Spring 容器，配置 ContextLoaderListener 监听器:

    ```xml
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:spring/spring-config.xml</param-value>
    </context-param>
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    ```

2. 配置 SpringMVC 前端控制器 DispatcherServlet 拦截所有请求，默认加载 WEB-INF 下的 【servlet-name】-servlet.xml 文件，可以通过 init-param 显示指定：

    ```xml
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>

        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring/springmvc-config.xml</param-value>
        </init-param>
        <!-- 管理 Servlet 的生命周期, 默认 servlet 在用户第一次访问时加载-->
        <!-- 设为 1 表示： DispatcherServlet 随项目启动加载-->
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
    ```

3. 添加字符编码过滤器，注意：字符编码过滤器最好配置为第一个过滤器，不然容易失效。

    ```xml
    <filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>

        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <param-name>forceRequestEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
        <init-param>
            <param-name>forceResponseEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <url-pattern>/**</url-pattern>
    </filter-mapping>
    ```

## spring-config.xml

1. 添加 Spring 的全局扫描，需要排斥 Controller 的扫描，交给 SpringMVC 的处理

    ```xml
    <context:component-scan base-package="com.tawe.crowdfunding.*">
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>
    ```

2. 加载 jdbc.properties:

    ```xml
    <context:property-placeholder location="classpath:jdbc.properties"/>
    ```

3. 设置 Druid 连接池：

    ```xml
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close">
        <property name="url" value="${jdbc.url}"/>
        <property name="driverClassName" value="${jdbc.driverClassName}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>
    ```

4. 整合 MyBatis, 加载 mybatis-config.xml 配置文件以及 mapper/*.xml mapper 文件:

    ```xml
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="configLocation" value="classpath:mybatis/mybatis-config.xml"/>
        <property name="dataSource" ref="dataSource"/>
        <property name="mapperLocations">
            <list>
                <value>classpath:mapper/*.xml</value>
            </list>
        </property>
    </bean>
    ```

5. 添加 MyBatis Dao 接口：

    ```xml
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.tawe.crowdfunding.dao"/>
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
    </bean>
    ```

6. 事务配置：

    ```xml
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>
    ```

7. 开启基于注解的事务控制：

    ```xml
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="*" propagation="REQUIRED" isolation="DEFAULT" rollback-for="java.lang.Exception"/>
            <tx:method name="get" read-only="true"/>
        </tx:attributes>
    </tx:advice>
    <aop:config>
        <aop:poiintcut id="txPoint" expresson="execution(* com.tawe.crowdfunding.service..*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="txPoint"/>
    </aop:config>
    ```

## spirngmvc-config.xml

1. 添加 SpringMVC 扫描路径，仅 Controller 即可

    ```xml
    <!-- 添加 SpringMVC 扫描 - 仅扫描 Controller-->
    <!-- Controller 由 SpringMVC 来管理扫描, 所以 Controller 要在 Spring 扫描中排除-->
    <context:component-scan base-package="com.tawe.crowdfunding.*" use-default-filters="false">
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>
    ```

2. 配置视图解析器：

    ```xml
    <bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
        <property name="prefix" value="/WEB-INF/jsp/"/>
        <property name="suffix" value=".jsp"/>
    </bean>
    ```

3. SpirngMVC 的其他相关配置：
   `<mvc:default-servlet-handler/>` : 将静态资源交由 default servlet 处理，
   `<mvc:annotation-driven/>`: 添加 RequestMappingHandlerAdapter, 是 Controller 可以处理 `@RequestMapping` 注解。

    ```xml
    <!--SpringMVC 标准配置：DefaultServletHandler & AnnotationDriven-->
    <mvc:default-servlet-handler/>
    <mvc:annotation-driven/>
    ```

## mybatis-config.xml

1. 添加 类路径 typeAliases

    ```xml
    <typeAliases>
        <package name="com.tawe.crowdfunding.entities"/>
    </typeAliases>
    ```

## pom.xml

```xml
<properties>
    <!--设置文件编码-->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <!-- jdk 版本 -->
    <maven.compiler.source>14</maven.compiler.source>
    <maven.compiler.target>14</maven.compiler.target>

    <spring.version>5.2.6.RELEASE</spring.version>
    <druid.version>1.1.16</druid.version>
    <mybatis.version>3.5.4</mybatis.version>
    <log4j.version>1.7.30</log4j.version>
    <mysql.version>8.0.19</mysql.version>
    <junit.version>4.13</junit.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-core</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-orm</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-web</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>${spring.version}</version>
    </dependency>

    <!-- spring-tx 依赖 spring-aspects -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aspects</artifactId>
        <version>${spring.version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-tx</artifactId>
        <version>${spring.version}</version>
    </dependency>

    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>${mybatis.version}</version>
    </dependency>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>2.0.4</version>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>${mysql.version}</version>
    </dependency>

    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>${druid.version}</version>
    </dependency>

    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>servlet-api</artifactId>
        <version>2.5</version>
    </dependency>
    <dependency>
        <groupId>javax.servlet.jsp</groupId>
        <artifactId>jsp-api</artifactId>
        <version>2.2</version>
    </dependency>
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>jstl</artifactId>
        <version>1.2</version>
    </dependency>
</dependencies>

```
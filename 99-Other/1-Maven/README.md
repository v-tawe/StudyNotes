# Maven 常用命令

Maven 结构

<groupId></groupId>
<artifactId></artifactId>
<version></version>

Maven 项目目录结构

- src
    - main
        - java
        - resources
    - test
- target

- mvn -v : 查看版本
- mvn compiler : 编译
- mvn test : 测试
- mvn package : 打包

- mvn clean : 清楚 target 包
- mvn install : 将包导入本地仓库

- mvn archetype:generate
- mvn archetype:generate -DgroupId=组织名, -DartifactId=项目名, -Dversion=版本号, -Dpackage=包名

## pom.xml 配置文件

<project 约束信息>

<!-- 指定当前 Pom 版本 -->
<modelVersion>4.0.0</modelVersion>

<groupId></groupId>
<artifactId></artifactId>
<version></version>
<!-- 打包方式 默认 jar, 可以设置 war, zip -->
<packaging></packaging>

<name>
<description>
<developers>
<licenses>
<organization>

<dependencies>
    <dependency>
        <groupId></groupId>
        <artifactId></artifactId>
        <version></version>
        <type>
        <!-- compile - 默认 - 编译、测试、运行-->
        <!-- provided - 编译、测试-->
        <!-- runtime - 测试、运行-->
        <!-- test - 测试-->
        <!-- system - 编译、测试-->
        <!-- import - 导入-->
        <scope>test</scope>
        <!-- 子项目是否依赖 -->
        <optional>true</optional>
        <exclusions>
            <exclusion></exclusion>
        </exclusions>
    </dependency>
</dependencies>
<!-- 依赖的管理 -->
<dependencyManagement>
<dependencies>
    <dependency>
    </dependency>
</dependencies>
</dependencyManagement>
<build>
    <!-- 插件的管理 -->
    <plugins>
        <plugin>
        <groupId></groupId>
        <artifactId></artifactId>
        <version></version>
        </plugin>
    </plugins>
</build>

<parent>
</parent>

<!-- 用于聚合-->
<!-- 可将多个项目一起编译、运行 -->
<modules>
    <module>path</module>
</modules>

</project>

## Maven 依赖

- 短路优先

    A -> B
    B -> C
    B -> 1.1
    C -> 1.2
    --------
    A -> 1.1

- 先申明

    A -> B
    A -> C
    B -> 1.1
    C -> 1.2
    --------
    A -> 1.1

## 

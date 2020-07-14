## Java 9 新特性

1. 模块化 - 使 Java 轻量化
1. Jshell - REPL tool

1. 接口提供私有方法 - Java8 接口开始提供方法体 - 接口静态方法只能接口进行调用
1. try 操作升级 - 自动关闭资源 
    - Java8 资源必须在（）中初始化 try (资源初始化) {}
    - Java9 资源可以在 try 外面初始化 try(资源对象) {}

## Java 10 新特性

### 类型推断

- 定义变量 var - 根据类型推断可以讲变量定义为 var ： `var list = new ArrayList<String>();`
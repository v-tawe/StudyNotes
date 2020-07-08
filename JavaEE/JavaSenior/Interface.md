# 注解 Annotation

通过 `@interface` 定义
可以使用 `default` 为 `value` 设置默认值

## 元注解 

`@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})` - 适用范围（何处可以加注解）
`@Retention(RetentionPolicy.RUNTIME)` - SOURCE - 只在编译阶段/CLASS - 存在字节码中/RUNTIME - 加载内存中，可通过反射找到该注解
`Documented` - javadoc 提取成文档
`Inherited` - 是否具有继承性
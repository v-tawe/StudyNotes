# Lambda 表达式

用于 代替匿名类 的创建，Lambda 表达式代表的也是一个对象。

要想使用 Lambda 表达式 对应的接口就必须是 函数式接口。

## 函数式接口

只有一个方法的接口

`@FunctionalInterface` 函数式接口
java.util 默认提供的 4 个函数式接口
- java.util.Comsumer -> void accept(T t)
- java.util.Supplier -> T get()
- java.util.Function -> R apply(T t)
- java.util.Predicate -> Boolean test(T t)

## 方法引用

本质上也是 Lambda 表达式
不需要参数列表, 会进行 参数推导

三种情况：

| | | |
| - | - | -|
|类 :: 静态方法 | (s1, s2) -> S.method(s1, s2) | S::Method |
|实例 :: 非静态方法 | s1 -> s1.method() | s1::Method |
|类 :: 非静态方法 | (s1, s2) -> s1.method(s2)| S1::Method |
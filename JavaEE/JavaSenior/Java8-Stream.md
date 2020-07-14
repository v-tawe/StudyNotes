# Stream API

对数据集合进行计算操作

## Stream 使用

必须要有以下 3 个步骤， 中间操作为延时操作，没有终止操作不会执行。

1. 获取 Stream
1. 中间 操作
1. 终止 操作

```java
collection.stream().filter().foreach(System.out::println);
```

## 常见 Stream API

中间操作：

- 过滤 - filter()
- 映射 - map(Function f) - 接受一个函数作为参数，该函数会被应用到每一个元素上，并将其映射成一个新的元素
- 排序 - sorted()/sorted(Comparator com) - 自然排序/定制排序

终止操作：

- 查找 - foreach()/max()/min()/...
- 规约 - reduce(BinaryOperator bo) - R apply(T t, U u); 累计操作 类似的 求和
- 收集 - collect(Collectors.toList()) - 获取一个集合

## Optional 类

- Optional.of(T t) - t is non-null
- Optional.ofNullable(T t) - t canbe null
- Optional.orElse(T t) - 如果 Optional 内部的对象为 null，则返回参数 t
- Optional.isPresent() - 内部对象是否为 Null
- Optional.get() - 获取内部对象
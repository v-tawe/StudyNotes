# Java 常用类

## String

1. String 声明为 final 的，不可被继承；
1. String 实现了 Serializable 接口 - 支持序列化；
1. String 实现了 Comparable 接口 - 可以比较大小；
1. String 通过 final char[] 实现存储字符串；
1. String 不可变性 - 保存在方法区的常量池中；
1. **常量与常量拼接还在常量池中，常量与变量拼接在堆中**；

可变性，用于字符串拼接：
`StringBuilder` 非线程安全，效率高
`StringBuffer` 线程安全

## Date

java.util.Date <===> java.sql.Date

通过 getTime() 进行转换：
```java
java.util.Date date = new java.util.Date();
java.sql.Date date2 = new java.sql.Date(date.getTime());
```

## System.currentTimeMillis()

## SimpleDateFormat

```java
SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
```

## Calendar

JDK 5.0 后用来代替 Date 类；

```java
Date date = calendar.getTime();
```

月份 - 1 月 - 0 开始
星期 - 礼拜日开始 - 1

## LocalDate/LocalTime/LocalDateTime

JDK 1.8 之后用来代替 Calendar 处理日期。

日期不变性，通过返回值返回修改后的日期，当前变量不会变。

- `now()` 获取当前时间
- `of(year, month, minite)` 获取指定时间

## Instant

类似于 java.util.Date 类

## DateTimeFormat

线程安全的

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日");
```

## Comparable

自然排序

对于自定义的类想要实现排序，可以通过实现 Comparable 接口，重写 `compareTo(Object o)` 方法

## Comparator

用于临时性比较规则，实现 Compare 方法，完成排序
不需要修改自定义类，相当于创建了一个单独的排序规则，在需要排序时，作为参数传入：

```java
Arrays.sort(T t, Comparator<? extends T> comparator)
```

## BigDecimal

精度要求比较高时使用

## Math
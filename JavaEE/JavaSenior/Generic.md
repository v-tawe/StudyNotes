## 泛型

- 泛型类：

  `class Demo<T> {}`
  `public T get(T t)`

  - 继承方面：

    - `class Parent<T>{}` - 定义 Parent 泛型类
      `Child extends Parent<String> {}` - 此时 Child 不是泛型类
      `Child<T> extends Parent<T> {}` 此时 Child 是泛型类

    - 类 `Parent` 时 类 `Child` 的父类，但是 `List<Parent>` 和 `List<Child>` 没有继承关系；
      不可以将 `List<Child>` 赋值给 `List<Parent>`

- 泛型方法: 泛型方法不需要类是泛型类

  `public <T> T get(T t)`

通配符：

`?` 通配符类型

- `<? extends T>` 上界通配符  
   表示类型的上界，表示参数化类型的可能是 T 或是 T 的子类;
- `<? super T>` 下界通配符  
   表示类型下界（Java Core 中叫超类型限定），表示参数化类型是此类型的超类型（父类型），直至 Object;

- 上界 `<? extends T>` 不能往里存，只能往外取
- 下界 `<? super T>` 只能往里存 T 及其子类，往外取都是 Object

## PECS 原贼

PECS（Producer Extends Consumer Super）原则：

频繁往外读取内容的，适合用上界 Extends。
经常往里插入的，适合用下界 Super。

## 总结

`extends` 可用于返回类型限定，不能用于参数类型限定（换句话说：`? extends xxx` 只能用于方法返回类型限定，jdk 能够确定此类的最小继承边界为 xxx，只要是这个类的父类都能接收，但是传入参数无法确定具体类型，只能接受 null 的传入）。
`super` 可用于参数类型限定，不能用于返回类型限定（换句话说：`? supper xxx` 只能用于方法传参，因为 jdk 能够确定传入为 xxx 的子类，返回只能用 Object 类接收）。
`?` 既不能用于方法参数传入，也不能用于方法返回。

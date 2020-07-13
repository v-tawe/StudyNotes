# 反射

Class 实例对应着一个运行时类，获取 Class 四种方式：

- 类.class
- 实例.getClass()
- Class.forName(String fullName)
- 通过类加载器： ClassLoader.loadClass()

## 常用方法

- 获取构造函数 - `Class.getDeclaredConstructor()`
- 获取方法 - `Class.getDeclaredMethod()`
- 调用方法 - `method.invoke(Instance, String... args)`
- 获取属性 - `Class.getDeclaredField()`
- 获取实例 - `Class.getDeclaredConstructor().newInstance()`
- 访问私有属性 - `field.SetAccessible(true)`

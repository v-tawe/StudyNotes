# 设计模式 GOF23(Group Of Four)

基本原则：

1. OCP 开闭原则，添加新功能时，应该增加新的扩展，而不是修改现有的；
2. DIP 依赖倒转原则，针对接口编程，而不是针对实现编程；
3. LoD 迪米特法则，至于直接的对象通信，避免陌生对象通信，减少耦合。

## 创建型模型

关注类的创建过程

### 单例模式 Singleton

单例模式只生成一个实例，减少系统的性能开销。

- 饿汉式 - 不能延时加载
- 懒汉式 - 可以延时加载
- 静态内部模式
- 枚举类

### 工厂模式 Factory

实现创建者和调用者的分离。

- 简单工厂 - 增加工厂类，通过工厂对象创建实例；- 不满足开闭原则
- 工厂方法模式 - 通过将 工厂 定义为接口来实现；- 满足了开闭原则，结构复杂度增加
- 抽象工厂模式 - 针对产品族

### 建造者模式 Builder

对象的子组件单独构造（Builder）与装配（Director），实现解耦，Builder 通常与工厂模式配合使用。

### 原型模式 Prototype

通过实现 Cloneable 接口实现 Clone 方法，实现对象的克隆。

- 浅克隆
- 深克隆
    - 属性克隆实现
    - 序列化、反序列化实现

## 结构型模型

关注对象和类的组织

### 适配器模式 adapter

使原本由于接口不兼容不能一起工作得类可以一起工作。

将类的接口转化为需要的接口。

- 目标接口 Target
- 适配器 Adapter
- 需要适配的类 Adaptee

- 类适配器 - 使用继承方式 - is-a
- 对象适配器 - 使用私有成员变量 聚合 - has-a

### 代理模式 proxy

为真实对象提供一个代理，从而控制对真实对象得访问。

通过代理，控制对象的访问。

AOP 面向切面编程的核心实现机制。

- 抽象角色 - 定义代理角色和真实角色的公共对外方法
- 真实角色 - 实现抽象角色，定义需要实现的业务逻辑
- 代理角色 - 实现抽象角色，实现统一的流程控制

- 静态代理
- 动态代理 - 通过字节码工具(javaassit)或JDK自带的动态代理

### 桥接模式 Bridge

处理多层继承结构，处理多维度变化得场景，将各个维度设计成独立得继承结构，使各个维度可以独立得扩展在抽象层建立关联。

通过接口，用于实现多重继承。
自身本就沿着**多个维度**变化，本身不稳定。

## 装饰模式 Decorator

动态的给一个对象添加额外的功能，比较灵活。

对真实对象增加子类时，不会造成类的膨胀。
用于增加新的功能，本身很稳定。

- 抽象构件 Component
- 具体构件 ConcreteComponent
- 装饰角色 Decorator

### Bridge vs. Decorator

两个模式都是为了解决多重继承得问题，只是诱因不同：
1.桥接模式对象自身有 沿着**多个维度**变化的趋势, 本身不稳定;
2.装饰者模式对象自身非常稳定, 只是为了增加新功能/增强原功能。

例如一辆车，可以有多个品牌，还可以有多个型号，每增加一种因素就是增加一个维度，此时用 Bridge;
对于一辆车，你可以给它刷一曾红色得漆，还可以再给它刷一层绿色得漆，此时对于车这个对象，它本身时是稳定的，只是需要增加额外的功能，此时用 Decorator。

### 组合模式 Composite

将对象组合成树状结构以表示 “部分和整体” 层次结构，使得客户可以统一的调用叶子对象和容器对象。

用于树形结构，实现树形递归

- 抽象构件 Component - 定义 Leaf & Composite 共同点
- 叶子 Leaf - 无子节点；
- 容器 Composite - 有子节点；

### 外观模式/门面模式 Facade

为一个子系统提供统一的接口，使得子系统更加容易使用。

迪米特法则：最少知识系统，

### 享元模式 FlyWeight

运用共享技术有效的实现管理大量细粒度对象，节省内存，提高效率。

以共享的方式重用多个相同或相似得对象，节省内存。

- 内部状态
- 外部状态

- FlyWeightFactory 享元工厂类 - 创建并管理享元对象，享元池一般设计成键值对
- FlyWeight 抽象享元类 - 通常是一个抽象类或接口，声明公共方法
- ConcreteFlyWeight 享元内部类 - 使用成员变量存储内部状态
- UnsharedFlyWeight 享元外部类 - 不能被共享得子类可以设计为非共享享元类

## 行为型模式

关注系统对象之间的交互，相互通信和协作。

### 责任链模式 ChainOfResponsibility

将处理同一类的请求的对象形成一条链。

- 抽象处理者 Handler
- 具体处理者 ConcreteHandler

### 迭代器模式 Iterator

- 聚合对象 - 存储数据
- 迭代器 - 遍历数据

### 中介者模式 Mediator

一个系统中对象之间的联系呈现网状结构，存在多对多的现象，可以引入中介者对象。
实现同事之间的解耦

### 命令模式 Command

将一个请求封装为一个对象，从而可以用不同的请求对客户进行参数化。
事务的底层实现即为命令模式。

- Invoker 调用者
- Command 抽象命令类
- Receiver 接收者
- ConcreteCommand 命令对象

### 备忘录模式 memeto

保存对象内部状态，实现撤销的操作

### 观察者模式 Observer

- Subject 消息发布
- Observer 消息订阅、

广播模式，用于群发消息

JavaSE 提供了 java.util.Observer / java.util.Observable 接口

### 状态模式 State

状态模式的切换

- Context 环境类 - 定于当前状态
- State 抽象状态类
- ConcreteState 具体状态类 - 封装一个状态的对应行为

### 策略模式 Strategy

解决某一个问题的一个算法族。
用于处理类型极多的情况，针对不同的类型需要使用不同的策略进行处理。

- Context 处理者，调用策略对象
- Strategy <Interface> - 策略接口
- concreteStrategy  - 具体策略对象

### 模板方法模式 template method

定义操作中的算法骨架，将某些步骤延迟到子类中实现。

- template method - 拥有一个 abstract 方法
- concrete template method - 实现 abstract 方法

使用抽象方法，在调用时实现（可以使用匿名类实现），本质就是多态的应用。

方法回调（钩子方法）

### <no>访问者模式</no>

对于存储在一个集合中的对象，
一个集合中有多种类型的子对象，用于处理其中一类对象的模式
例如： xml 文档处理

### <no>解释器模式</no> Interpreter

用于解析特定事物
不推荐的设计模式
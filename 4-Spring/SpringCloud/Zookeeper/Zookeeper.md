# Zookeeper

## 概念

ZooKeeper 是一个典型的分布式数据一致性解决方案，分布式应用程序可以基于 ZooKeeper 实现诸如**数据发布/订阅**、**负载均衡**、**命名服务**、**分布式协调/通知**、**集群管理**、**Master 选举**、分布式锁和分布式队列等功能。
Zookeeper 一个最常用的使用场景就是用于担任服务生产者和服务消费者的注册中心。

为了保证高可用，最好以集群形态来部署 ZooKeeper，并且推荐以**奇数**台服务器来搭建集群。

## Session 会话

Session 指的是 Client 向 Server 建立的一个 TCP 长连接。

每次 Client 创建 Session 时，Server 都会向 Client 分配一个 ClientID 最为标识，此 ClientID 必须全局唯一。

## ZNode 节点

Znode 分为 持久 和 临时 两类节点，

- 持久节点 - 一旦 ZNode 被创建将永久的保存在 ZooKeeper 上，除非主动进行 ZNode 的删除操作
- 临时节点 - 一旦 Session 结束 node 将被移除，它的生命周期和客户端会话绑定

- SEQUENTIAL - 该属性表明 ZNode 被创建时会在其节点名后面附带一个自增的数字（从 0 开始）

## Watcher 监听

ZooKeeper 允许用户在指定的节点上注册一些 Watcher，在特定的时间触发时，ZooKeeper 会将事件通知到订阅的客户端上，该机制是 ZooKeeper 分布式协调服务重要特性。

## ACL 权限

ACL AccessControllLists 策略进行权限控制：

- CREATE
- READ
- WRITE
- DELETE
- ADMIN

## 角色

**未采用** master/slave 主备模式，采用了 Leader, Follower 和 Observer 三种角色：

ZooKeeper 中所有机器通过选举选出一个 Leader

| 角色     | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| Leader   | 负责更新系统状态                                              |
| Follower | 负责客户的请求，并**参与**选举投票                             |
| Observer | 负责接收客户端的连接，并将请求转发给 Leader ，**不参与**选举投票 |
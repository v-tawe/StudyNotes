# NoSQL

NoSQL: Not Only SQL
非关系型数据库

- key-valut 类型 NoSQL： Redis
- 文档型 NoSQL： MongoDB
....


## Redis 应用场景

1. 缓存
2. 任务队列
3. 网站访问统计
4. ....

## string

- set name value
- get name
- del name
- incr num 累加

## HashSet

- hset set name value
- hget set name

## list

有序的合集

- lrange list查看
- lpush list values 左侧插入
- rpush list values右侧插入
- lpop list 左侧弹出
- rpop list 右侧弹出
- llen list 查看list个数
- lrem mylist num value 从左侧开始删除 list 指定个数的元素 num = 0 则全部删除
- lset 设定指定位置的值


## set

不允许出现重复的元素

- sadd 添加值
- srem 删除值
- smemebers 查看 set
- sismember 是否有值
- sdiff set1 set2 差值运算 - set2 中没有的
- sinter set1 set2 合集运算 - 都有的
- sunion set1 set2 并集运算 - 所有的

## sorted-set

每个成员都有一个分数用来进行排序

- zadd set score member 添加成员
- zscore set member 获取分数
- zcard set 获取长度
- zrem set member 删除成员
- zrange set 0 -1 显示成员list


## 常用命令

- select 0/1 选择第几个数据库
- exists name 查询是否存在
- rename name1 name2 重命名
- keys name/* 返回集合
- type name 返回类型

## 事务

- multi 开启事务
- exec 提交
- discard 撤销

## 持久化

redis.config 中配置

RDB - 定时持久化-存储再磁盘文件.rdb上 - 默认 dump.rdb
AOF - 按秒同步/按写入同步 appendonly.aof
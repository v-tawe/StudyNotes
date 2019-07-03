# SQL 笔记

## SQL 简介

SQL = Structured Query Language

总的来说，SQL语言定义了这么几种操作数据库的能力：

- DDL：Data Definition Language

    DDL允许用户定义数据，也就是创建表、删除表、修改表结构这些操作。通常，DDL由数据库管理员执行。

- DML：Data Manipulation Language

    DML为用户提供添加、删除、更新数据的能力，这些是应用程序对数据库的日常操作。

- DQL：Data Query Language

    DQL允许用户查询数据，这也是通常最频繁的数据库日常操作。

## 数据库类别

- 关系型数据库(SQL)
- 非关系型数据库(NoSQL) - MongoDB, Cassandra, Dynamo

## 关系模型

### 主键

主键是关系表中记录的唯一标识。选取主键的一个基本原则是：不使用任何业务相关的字段作为主键。

```SQL
ALTER TABLE <student>
ADD CONSTRAINT <pk_id>
PRIMARY KEY (<id>);
```

### 外键

外键是用来关联 2 个表结构的，表直接的约束分为以下 3 种：

1. 一对一
2. 一对多 - 外键建立在‘多’的表中(即从表)
3. 多对多 - 需要建立中间表

- 创建外键

    ```SQL
    ALTER TABLE <student>
    ADD CONSTRAINT <fk_class_id>
    FOREIGN KEY (<class_id>)
    REFERENCES classes (<id>);
    ```

- 删除外键

    ```SQL
    ALTER TABLE <students>
    DROP FOREIGN KEY <fk_class_id>;
    ```

### 索引

索引是关系数据库中对某一列或多个列的值进行预排序的数据结构。通过使用索引，可以让数据库系统不必扫描整个表，而是直接定位到符合条件的记录，这样就大大加快了查询速度。

```SQL
ALTER TABLE <students>
ADD INDEX <idx_name_score> (<name>, <score>);
```

- 唯一索引

    ```SQL
    ALTER TABLE <students>
    ADD UNIQUE INDEX <uni_name> (<name>);
    ```

### 约束

根据业务要求，像身份号、手机号、邮箱地址等，它们具有业务含义不易作为主键，但是又具有唯一性：即不能出现两条记录存储了同一个身份证号。这个时候，就可以给该列添加一个唯一约束。

```SQL
ALTER TABLE <students>
ADD CONSTRAINT <uni_name>
UNIQUE (<name>);
```

### SQL 查询

不带 `FROM` 子句的 `SELECT` 语句有一个有用的用途，就是用来判断当前到数据库的连接是否有效。许多检测工具会执行一条 `SELECT 1;` 来测试数据库连接。

1. 基本查询 - `SELECT * FROM <students>`
1. 条件查询 - `SELECT * FROM <students> WHERE id = 1`
1. 投影查询 - `SELECT id, name FROM <students>`
1. 排序 - `SELECT * FROM <students> ORDER BY id DESC`
    NOTE: `OREDER BY` 要在 `WHERE` 条件后
1. 分页查询 - `SELECT * FROM <students> LIMIT <10> OFFSET <0>`
    `pageSize` - `LIMIT`
    `pageIndex` - `OFFSET`=`pageSize * (pageIndex - 1)`, `pageIndex` 从 `1` 开始，而 `OFFSET` 从 `0` 开始。
1. 聚合查询
    聚合函数：`COUNT(), SUM(), AVG(), MAX(), MIN()`
    通过 `GROUP BY` 进行分组
    `SELECT <class_id>, <gender>, COUNT(*) num FROM <students> GROUP BY <class_id>, <gender>;`
1. 多表查询 - `SELECT * FROM <students>, <classes>;` 获得的集合为 A 表行数 * B 表行数
1. 连接查询
    - 内连接(INNER JOIN)
    - 外连接(OUTER JOIN)
        - 左连接(LEFT OUTER JOIN)
        - 右连接(RIGHT OUTER JOIN)
        - 全连接(FULL OUTER JOIN)

    | INNER JOIN | LEFT OUTER JOIN | RIGHT OUTER JOIN | FULL OUTER JOIN |
    | :-------: | :-------------: | :--------------: | :-------------: |
    | 两张表都存在的记录 | 左表存在的记录 | 右表存在的记录 | 左右表都存在的记录 |
    | ![](INNER_JOIN.png) | ![](LEFT_OUTER_JOIN.png) | ![](RIGHT_OUTER_JOIN.png) | ![](FULL_OUTER_JOIN.png) |

### SQL 修改

关系数据库的基本操作就是增删改查，即 `CRUD：Create、Retrieve、Update、Delete`。

对于增、删、改，对应的SQL语句分别是：

- `INSERT`：插入新记录 - `INSERT INTO <表名> (字段1, 字段2, ...) VALUES (值1, 值2, ...);`
- `UPDATE`：更新已有记录 - `UPDATE <表名> SET 字段1=值1, 字段2=值2, ... WHERE ...;`
- `DELETE`：删除已有记录 - `DELETE FROM <表名> WHERE ...;`

## 常用 SQL 语句

### 数据库 + 表操作 SQL 语句

| SQL 语句 | 含义 |
| ------- | ---- |
| SHOW DATABASES | 列出所有数据库 |
| CREATE DATABASE <database_name> | 创建数据库 |
| DROP DATABASE <database_name> | 删除数据库 |
| USE <database_name> | 切换当前数据库 |
| SHOW TABLES | 列出所有表 |
| DESC <table_name> | 查看表结构 |
| SHOW CREATE TABLE <table_name> | 查看创建表的 SQL 语句 |
| DROP TABLE <table_name> | 删除表 |
| ALTER TABLE <table_name> ADD COLUMN <column_name> VARCHAR(10) NOT NULL | 新增列 |
| ALTER TABLE <table_name> CHANGE COLUMN <column_name> VARCHAR(20) NOT NULL | 修改列属性 |
| ALTER TABLE <table_name> DROP COLUMN <column_name> | 删除列 |
| EXIT | 退出 MYSQL 连接 |

### 实用 SQL 语句

- 插入或替换
    `REPLACE INTO <students> (<id>, <class_id>, <...>) VALUES(<1>, <1>, <...>)`
    若 `id=1` 记录不存在，插入新纪录； 若 `id=1` 记录存在，当前 `id=1` 记录被删除，然后再插入新纪录。
- 插入或更新
    `INSERT INTO <students> (<id>, <class_id>, <name>, <...>) VALUES(<1>, <1>, <'xiao_min'>, <...>) ON DUPLICATE KEY UPDATE <name>=<'xiao_min'>, <...>;`
    若 `id=1` 记录不存在，插入新纪录； 若 `id=1` 记录存在，当前 `id=1` 记录被更新，更新字段有 `UPDATE` 指定。
- 插入或忽略
    `INSERT IGNORE INTO <students> (<id>, <class_id>, <...>) VALUES(<1>, <1>, <...>);`
    若 `id=1`记录不存在，`INSERT` 语句将插入新记录，否则，不执行任何操作。
- 快照
    `CREATE TABLE <students_of_class1> SELECT * FROM <students> WHERE <class_id>=<1>;`
    通过查询集合创建新表

## 事务操作

多条语句作为一个整体进行操作的功能，被称为数据库事务。数据库事务可以确保该事务范围内的所有操作都可以全部成功或者全部失败。如果事务失败，那么效果就和没有执行这些 SQL 一样，不会对数据库数据有任何改动。

- `BEGIN` 开启一个事务
- `COMMIT` 提交一个事务
- `ROLLBACK` 回滚事务

### 隔离级别

- **脏读 DIRTY READ**： 查询同一记录，2 次结果**不一样**，读到还未 commit 的数据结果；
- **不可重复读 NON REPEATABLE READ**： 查询同一记录，2 次结果**不一样**，读到的结果在另一事务 commit/rollback 之间；
- **幻读 PHANTOM READ**：查询同一记录，2 次结果是**一样**，但是会出现 事务 A 新增的列，事务 B 读不到(`SELECT`)，但是却可以更新(`UPDATE`)，更新后才可以读到。


| ISOLATION LEVEL  | DIRTY READ | NON REPEATABLE READ | PHANTOM READ |
| :--------------: | :--------: | :------------------: | :----------: |
| READ UNCOMMITTED |     YES    |          YES         |      YES     |
| READ COMMITTED   |      -     |          YES         |      YES     |
| Repeatable Read  |      -     |           -          |      YES     |
| Serializable     |      -     |           -          |       -      |

**Serializable** 虽然隔离级别最高，但是效率会大大下降。
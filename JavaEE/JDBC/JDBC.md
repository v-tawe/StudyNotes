# JDBC

## 常规查询步骤

1. 加载驱动 - `Class.forName("com.mysql.jdbc.Driver");`
1. 建立连接 - `DriverManager.getConnection(url, user, password);`
1. 预编译 SQL 语句 - `connection.prepareStatement(sql);`
1. 执行查询 - `preparedStatement.executeQuery();`
1. 获取结果集 - `resultSet.next();`
1. 关闭连接 - `connection.close(); preparedStatement.close(); resultSet.close();`

### 处理结果集

```sql
// 获取结果集得元数据
ResultSetMetaData metaData = resultSet.getMetaData();
// 获取结果集得列数
int columnCount = metaData.getColumnCount();
// 获取结果集得列名
String columnName = metaData.getColumnName(1);
// 获取结果集得列别名
String columnLabel = metaData.getColumnLabel(1);
```

## Statement & PreparedStatement

Statement - 加载 SQL 执行语句
PreparedStatement - 使用 占位符 得预编译 SQL 执行语句；可以解决 SQL 注入 问题。

### 批量插入

`?rewriteBatchedStatements=true` 添加在 url 后开启批量操作；

```sql
preparedStatement.addBatch();
preparedStatement.executeBatch();
preparedStatement.clearBatch();
```

## 数据库连接池

- C3P0
- DBCP
- Druid
  - 获取连接 DruidDataSource
  - 执行查询 Commons-DBUtils
  - 关闭连接 Commons-DBUtils

## JDBC 操作类

- commons-dbutils

## 示例程序

```java

// 创建连接池，通过静态代码块创建
private static DataSource dataSource;
static {
    try(InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("jdbc.properties")) {
        Properties pros = new Properties();
        pros.load(is);
        dataSource = DruidDataSourceFactory.createDataSource(pros);
    } catch (Exception e) {
        e.printStackTrace();
    }
}

// 获取连接
try(Connection connection = dataSource.getConnection()) {

    // 执行查询，使用 ResultSetHandler 返回 DAO 得 List - 支持泛型
    QueryRunner queryRunner = new QueryRunner();
    ResultSetHandler<List<Demo>> res = new BeanListHandler<>(Demo.class);
    List<Demo> demos = queryRunner.query(connection, "SQL", res);

    // 执行查询，使用 MapListHandler 返回一个 MapList - 没有泛型
    MapListHandler mapHandler = new MapListHandler();
    List<Map<String, Object>> maps = queryRunner.query(connection, "SQL", res);
    maps.forEach(map -> System.out.println(map));

} catch (Exception e) {
    e.printStackTrace();
}
```

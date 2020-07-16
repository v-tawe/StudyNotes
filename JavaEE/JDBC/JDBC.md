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

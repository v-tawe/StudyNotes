# IO 流

## File

既可以代表 目录 也可以代表 文件:

`new File(String path)` : 相对路径 或 绝对路径
`new File(String parentPath, String name)`

## IO 流

| 流类型 | 抽象基类     | 节点流           | 缓冲流               | 转换流(字节&字符转换) | 对象流(序列化&反序列化) |
| ------ | :----------- | :--------------- | :------------------- | --------------------- | ----------------------- |
| 字节流 | InputStream  | FileInputStream  | BufferedInputStream  |                       | ObjectInputStream       |
| 字节流 | OutputStream | FileOutputStream | BufferedOutputStream |                       | ObjectOutputStream      |
| 字符流 | Reader       | FileReader       | BufferedReader       | InputStreamReader     |                         |
| 字符流 | Writer       | FileWriter       | BufferedWriter       | OutputStreamWriter    |                         |

基础步骤：

1. 创建 流对象；- `InputStream is = new FileInputStream(String pathName)`
1. 读取数据；- `is.read(byte[])`
1. 关闭连接；- `is.close()`

> 需要使用 try-catch-finally 处理异常!

## Commons 工具类

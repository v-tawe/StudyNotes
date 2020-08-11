# 网络编程

IP 与 端口号 - `InetAdress`
网络通信协议：应用层、传输层、网络层、数据链路层

TCP 连接：

Client:

1. 创建 `socket` 对象； - 指定 服务器的 IP 及 端口
1. 创建 IOStream 对象；
1. 发送/读取流中的数据
1. 关闭连接

Server:

1. 创建 `ServerSocket` 对象；
1. `accept()` 启动监听;
1. 创建 IOStream 对象；
1. 发送/接受流中的数据
1. 关闭连接
 
UDP 连接：

1. 创建 DatagramSocket 对象；
1. 创建 DatagramPacket 对象发送数据；
1. 
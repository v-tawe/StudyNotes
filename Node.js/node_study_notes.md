# Node.js 学习笔记

## 模块化

Node 利用 JavaScript 的函数式编程特性，实现模块的隔离。

```javascript
(function() { ... })();
```

使用 `module.exports = <functionName>` 将函数暴露出去， 调用处用 `require('<module_name>')` 拿到暴露的函数。

## 基本模块

### fs

文件系统模块 `fs`: 分为**异步方法**和***同步方法**。

- 异步读文件: `fs.readFile('<FileName>', 'utf-8', function(err, data){ ... });`
- 同步读文件: `var data = fs.readFileSync('<FileName>', 'utf-8');`
    错误通过 `try {...} catch() {...}` 捕获。
- 异步写文件: `fs.writeFile('<FileName>', data, function(err) { ... });`
    传入的 data 是 String, 默认按 UTF-8 写入，传入的 data 是 Buffer, 则写入二进制文件。
- 同步写文件: `fs.writeFileSync('<FileName>', data);`
- 异步获取文件属性: `fs.stat('<FileName>', function(err, stat) { ... });`
- 同步获取文件属性: `var stat = fs.statSync('<FileName>');`

### stream

数据流读取/写入 `fs.createReadStream`, `fs.createWriteStream`

管道连接 `readable.pipe(writeable, {end:true/false});`

### http

- `http` 模块 - 提供 `request` 和 `response` 对象
    `http.createServer(function(request, response) {...});` 创建 Web Server
- `url` 模块 - web 路径
- `path` 模块 - 本地文件目录

### crypto

`crypto` 提供 加密和哈希算法。

- `crypto.createHash('md5');` - 哈希算法 MD5及SHA1
- `crypto.createHmac('sha256', 'secret-key');` - 哈希算法 Hmac 需要额外的一个密钥
- `crypto.createCipher('aes192', 'secret-key');` - AES 对称加密算法, 加解密用同一个密钥
- `crypto.createDiffieHellman(prime, generator);` - DH 算法，密钥交换协议，双方在不泄露密钥的情况下生成一个密钥
- `crypto.create` - 非对称算法，RSA 一个公钥和一个私钥构成密钥对
    RSA 不适合加密大数据，对于大数据加密，先生成一个 AES 密钥加密大数据，然后用 RSA 加密 AES 密钥，实际使用时，传输 AES 和 RSA 2 份密钥。

## Web 开发

### koa


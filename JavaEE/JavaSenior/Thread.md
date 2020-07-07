## 多线程学习笔记

两种方法实现多线程：

1. 继承 Thread 类； - 重写 run() 方法
1. 实现 Runnable 接口；- 实现 run() 方法
1. 实现 Callable 接口；- 实现 call() 方法，借助 FutureTask 类创建 Thread - FutureTask.get() 方法获取的就是 call() 的返回值
1. 线程池; - 通过 Executors.newFixedThreadPool() 方法 返回 ExecutorService 类 - service.execute(Runnable runnable)/shutdown() 启动/关闭线程

## Thread 状态

1. 新建 - New
1. 就绪 - Runnable
1. 运行 - Running
1. 阻塞 - Blocked
1. 死亡 - Dead

Tread --new--> **New** --start()--> **Runnable** --get CPU--> **Running** --yield()--> **Runnable** --sleep(milles)--> **Blocked** --stop()--> **Dead**

## Thread 常用方法

| Method                         | Details                                       |
| ------------------------------ | --------------------------------------------- |
| start()                        | 启用一个新的线程                              |
| run()                          | 重写 Thread 中的 run 方法，新线程会执行该方法 |
| getName()                      | 获取当前线程名称                              |
| setName(String name)           | 设置当前线程名称                              |
| yield()                        | 释放当前线程 CPU 的控制权，**会放弃当前锁**   |
| join()                         | 加入一个新线程，当前线程阻塞                  |
| sleep(long mills)              | 当前线程进入阻塞状态，**不会放弃当前锁**      |
| wait() -> Object               | 当前线程阻塞，**会放弃当前锁**                |
| notify()/notifyAll() -> Object | 唤醒阻塞的线程                                |
| isAlive()                      | 判断当前线程是否仍存活                        |
| getPriority()                  | 获取线程优先级                                |
| setPriority(int PRIORITY)      | 设置线程优先级                                |

## 同步机制

1. 同步代码块

   ```java
   synchronized(同步监视器) {
   // 需要被同步的代码
   }
   ```

   1. 操作共享数据的代码，即为需要被同步的代码；
   1. 同步监视器，即为锁，多个线程必须要共用同一把锁；
      1. 对于实现 Runnable 的类，可以使用 this 充当同步锁；
      1. 对于继承 Thread 的类，可以使用 Thread.Class 当同步锁；

1. 同步方法

   - 非静态同步方法，同步监视器为：this
   - 静态同步方法，同步监视器为：类本身 Thread.Class

   - 继承 Thread, 方法必须是静态方法；
   - 实现 Runnable， 方法可以是非静态方法；

   ```java
   synchronized void method() {
   }
   ```

1. ReentrantLock 锁

   ```java
   ReentrantLock lock = new ReentrantLock();
   lock.lock();
   try{
       ...
   } finally {
       lock.unlock();
   }
   ```

## 死锁

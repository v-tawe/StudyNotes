/**
 * @ClassName ThreadTest
 * @Description 创建 Thread 测试
 * @Author davidt
 * @Date 7/7/2020 11:01 AM
 * @Version 1.0
 **/
public class ThreadTest {

    public static void main(String[] args) {
        MyThread thread = new MyThread();
        thread.start();
        for (int i = 0; i < 100; i++) {
            System.out.println(Thread.currentThread().getName() + "i = " + i);
        }
    }

}

class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            System.out.println(Thread.currentThread().getName() + "i= " + i);
        }
    }
}
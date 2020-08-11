/**
 * @ClassName DeadLocker
 * @Description 通过同步代码块实现死锁
 * @Author davidt
 * @Date 7/7/2020 4:04 PM
 * @Version 1.0
 **/
public class DeadLockBlock {

    public static void main(String[] args) {

        Object o1 = new Object();
        Object o2 = new Object();
        new Thread(new MyThread1(o1, o2)).start();
        new Thread(new MyThread2(o1, o2)).start();

    }

}

class MyThread1 implements Runnable {

    Object o1, o2;

    public MyThread1(Object o1, Object o2) {
        this.o1 = o1;
        this.o2 = o2;
    }

    @Override
    public void run() {
        synchronized (o1) {
            print();

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (o2) {
                print();
            }
        }
    }

    private synchronized void print() {
        System.out.println("MyThread1.print");
    }
}

class MyThread2 implements Runnable {

    Object o1, o2;

    public MyThread2(Object o1, Object o2) {
        this.o1 = o1;
        this.o2 = o2;
    }

    @Override
    public void run() {
        synchronized (o2) {
            print();

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (o1) {
                print();
            }
        }
    }

    private synchronized void print() {
        System.out.println("MyThread2.print");
    }
}
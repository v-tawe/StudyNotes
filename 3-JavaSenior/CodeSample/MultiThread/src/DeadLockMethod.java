/**
 * @ClassName DeadLockMethod
 * @Description TODO
 * @Author davidt
 * @Date 7/7/2020 4:31 PM
 * @Version 1.0
 **/
public class DeadLockMethod {
    public static void main(String[] args) {
        DeadLockThread target = new DeadLockThread();
        new Thread(target).start();
        target.run1();
    }
}

class DeadLockThread implements Runnable {

    A a = new A();
    B b = new B();

    @Override
    public void run() {
        try {
            a.printPre(b);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void run1() {
        try {
            b.printPre(a);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private class A {
        private synchronized void printPre(B b) throws InterruptedException {
            System.out.println("A.printPre");
            Thread.sleep(100);
            b.printBack();
        }

        private synchronized void printBack() throws InterruptedException {
            System.out.println("A.printBack");
            Thread.sleep(100);
        }
    }

    private class B {
        private synchronized void printPre(A a) throws InterruptedException {
            System.out.println("B.printPre");
            Thread.sleep(100);
            a.printBack();
        }

        private synchronized void printBack() throws InterruptedException {
            System.out.println("B.printBack");
            Thread.sleep(100);
        }
    }
}
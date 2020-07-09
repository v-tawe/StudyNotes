import java.util.concurrent.locks.ReentrantLock;

/**
 * @ClassName LockTest
 * @Description TODO
 * @Author davidt
 * @Date 7/7/2020 4:54 PM
 * @Version 1.0
 **/
public class LockTest {
    public static void main(String[] args) {
        TicketWindow2 ticketWindow2 = new TicketWindow2();

        Thread win1 = new Thread(ticketWindow2);
        Thread win2 = new Thread(ticketWindow2);
        Thread win3 = new Thread(ticketWindow2);

        win1.setName("窗口1");
        win2.setName("窗口2");
        win3.setName("窗口3");

        win1.start();
        win2.start();
        win3.start();
    }
}

class TicketWindow2 implements Runnable {
    private int ticketNums = 1000;
    private ReentrantLock lock = new ReentrantLock();

    @Override
    public void run() {

        while (ticketNums > 0) {
            lock.lock();
            try {
                if (ticketNums > 0) {
                    ticketNums--;
                    System.out.println(Thread.currentThread().getName() + "- 卖票 - 剩余：" + ticketNums);
                }

            } finally {
                lock.unlock();
            }
        }
    }
}
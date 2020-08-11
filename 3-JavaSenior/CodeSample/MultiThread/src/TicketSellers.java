/**
 * @ClassName TicketSellers
 * @Description 创建三个窗口卖票，总票数 100 张
 * @Author davidt
 * @Date 7/7/2020 11:39 AM
 * @Version 1.0
 **/
public class TicketSellers {
    public static void main(String[] args) {
        TicketWindow ticketWindow = new TicketWindow();
        Thread win1 = new Thread(ticketWindow);
        Thread win2 = new Thread(ticketWindow);
        Thread win3 = new Thread(ticketWindow);

        win1.setName("窗口1");
        win2.setName("窗口2");
        win3.setName("窗口3");

        win1.start();
        win2.start();
        win3.start();
    }
}

class TicketWindow implements Runnable {
    private int ticketNums = 1000;

    @Override
    public void run() {

        while (ticketNums > 0) {
            synchronized (this) {
                if (ticketNums > 0) {
//                    try {
//                        Thread.sleep(100);
//                    } catch (InterruptedException e) {
//                        e.printStackTrace();
//                    }
                    ticketNums--;
                    System.out.println(Thread.currentThread().getName() + "- 卖票 - 剩余：" + ticketNums);
                }
            }
        }
    }
}


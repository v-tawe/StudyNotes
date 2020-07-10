import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.util.Scanner;

/**
 * @ClassName SocketClientTest
 * @Description TODO
 * @Author davidt
 * @Date 7/10/2020 4:21 PM
 * @Version 1.0
 **/
public class TCPClient {

    public static void main(String[] args) {
        Socket socket = null;
        OutputStream os = null;
        InputStream is = null;
        try {
            socket = new Socket("localhost", 8899);
            os = socket.getOutputStream();

            while (true) {
                Scanner scanner = new Scanner(System.in);
                System.out.println("请输入：...");
                String s1 = scanner.nextLine();
                if ("q".equals(s1) || "exit".equals(s1)) {
                    System.out.println("连接已断开");
                    socket.shutdownOutput();
                    break;
                }
                os.write(s1.getBytes());
                System.out.println("数据已发送!");
            }

            // 接受消息
            byte[] bytes2 = new byte[1024];
            is = socket.getInputStream();
            int len2;
            while ((len2 = is.read(bytes2)) != -1) {
                String str2 = new String(bytes2, 0, len2);
                System.out.println(str2);
            }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (socket != null) {
                try {
                    socket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }


    }


}

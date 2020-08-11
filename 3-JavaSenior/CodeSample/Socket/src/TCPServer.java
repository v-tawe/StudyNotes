import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * @ClassName SocketTest
 * @Description TODO
 * @Author davidt
 * @Date 7/10/2020 4:20 PM
 * @Version 1.0
 **/
public class TCPServer {
    public static void main(String[] args){
        ServerSocket serverSocket = null;
        Socket socket = null;
        OutputStream outputStream = null;
        InputStream inputStream = null;
        try {
            serverSocket = new ServerSocket(8899);
            System.out.println("服务器已启动，等待客户端连接...");
            socket = serverSocket.accept();

            System.out.println("服务器已启动");
            System.out.println(socket.getInetAddress().getHostName());
            System.out.println(socket.getInetAddress().getHostAddress());

            inputStream = socket.getInputStream();
            InputStreamReader isr = new InputStreamReader(inputStream);
            char[] bytes = new char[5];
            int len;
            String str = new String();

            while ((len = isr.read(bytes)) != -1) {
                System.out.println("等待接受数据：");
                str += new String(bytes, 0 , len);
            }
            System.out.println(str);

            // 发送消息
            outputStream = socket.getOutputStream();
            outputStream.write("消息已收到，谢谢".getBytes());

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }
            if (inputStream != null) {
                try {
                    inputStream.close();
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
            if (serverSocket != null) {
                try {
                    serverSocket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }
        }
    }
}

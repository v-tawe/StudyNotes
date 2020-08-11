import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;

/**
 * @ClassName UDPServer
 * @Description TODO
 * @Author davidt
 * @Date 7/10/2020 5:32 PM
 * @Version 1.0
 **/
public class UDPServer {
    public static void main(String[] args) {
        try {
            DatagramSocket datagramSocket = new DatagramSocket(8899);
            byte[] bytes = new byte[1024];
            DatagramPacket datagramPacket = new DatagramPacket(bytes, bytes.length);
            datagramSocket.receive(datagramPacket);
            bytes = datagramPacket.getData();
            System.out.println(new String(bytes));
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
        }


    }
}

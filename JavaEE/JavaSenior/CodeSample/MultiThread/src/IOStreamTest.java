import java.io.*;

/**
 * @ClassName IOStreamTest
 * @Description TODO
 * @Author davidt
 * @Date 7/10/2020 2:53 PM
 * @Version 1.0
 **/
public class IOStreamTest {
    public static void main(String[] args) {
        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        try {
            FileInputStream is = new FileInputStream("test.txt");
            FileOutputStream os = new FileOutputStream("helloworld.txt");
            bis = new BufferedInputStream(is);
            bos = new BufferedOutputStream(os);

            byte[] bytes = new byte[5];
            int len;
            String str = new String();
            while((len=bis.read(bytes)) != -1) {
//                for (int i = 0; i < len; i++) {
//                    System.out.print((char)bytes[i]);
//                }
                str += new String(bytes, 0, len);
                bos.write(bytes, 0, len);
            }
            System.out.println(str);

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (bis!=null) {
                try {
                    bis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (bos!=null) {
                try {
                    bos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

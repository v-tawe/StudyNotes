import java.io.*;

/**
 * @ClassName IOReaderTest
 * @Description TODO
 * @Author davidt
 * @Date 7/10/2020 3:31 PM
 * @Version 1.0
 **/
public class IOReaderTest {

    public static void main(String[] args) {
        BufferedReader br = null;
        BufferedWriter bw = null;
        try {
            br = new BufferedReader(new FileReader("test.txt"));
            bw = new BufferedWriter(new FileWriter("test1.txt"));

            String str;
            while ((str = br.readLine()) != null) {
                System.out.println("str = " + str);
                bw.write(str);
                bw.newLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (bw != null) {
                try {
                    bw.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

}

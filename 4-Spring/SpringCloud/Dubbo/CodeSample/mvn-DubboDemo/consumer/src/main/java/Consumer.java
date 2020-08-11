import com.kyss.dubbo.demo.DemoService;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * @ClassName Consumer
 * @Description TODO
 * @Author davidt
 * @Date 7/22/2020 3:44 PM
 * @Version 1.0
 **/
public class Consumer {
    public static void main(String[] args) throws Exception {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[] {"classpath:consumer.xml"});
        context.start();
        DemoService demoService = (DemoService)context.getBean("demoService"); // 获取远程服务代理
        for (int i = 0; i < 10; i++) {
            demoService.sayHello("world");
        }
        String hello = demoService.sayHello("world"); // 执行远程方法
        System.out.println( hello ); // 显示调用结果
    }
}

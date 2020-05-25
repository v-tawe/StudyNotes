import com.dao.PaperDao;
import com.pojo.Paper;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.util.List;

/**
 * @ClassName PaperTest
 * @Description TODO
 * @Author davidt
 * @Date 5/21/2020 3:41 PM
 * @Version 1.0
 **/
public class PaperTest {
    @Test
    public void testPaper() {
        ApplicationContext ac = new ClassPathXmlApplicationContext(ResourceLoader.CLASSPATH_URL_PREFIX+"spring/spring-dao.xml");
        PaperDao paperDao = ac.getBean(PaperDao.class);
        List<Paper> paperList = paperDao.queryAllPaper();
        Assert.assertNotNull(paperList);
        System.out.println("hello here");
    }
}

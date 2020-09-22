package com.tawe.crowd;

import com.tawe.crowd.dao.AdminMapper;
import com.tawe.crowd.entity.Admin;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

/**
 * @ClassName CrowdSpringTest
 * @Description Crowd Testing
 * @Author Administrator
 * @Date 9/22/2020 11:26 AM
 * @Version 1.0
 **/

// 指定 Spring 给 Junit 提供的运行器
@RunWith(SpringJUnit4ClassRunner.class)
// 加载 Spring 配置文件
@ContextConfiguration(locations = {"classpath:spring-persist-mybatis.xml"})
public class CrowdSpringTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private AdminMapper adminMapper;

    @Test
    public void testDataSource() throws SQLException {

        Connection connection = dataSource.getConnection();
        System.out.println(connection);
    }

    @Test
    public void testCalendar() {
        System.out.println(new SimpleDateFormat("yyyy-MM-dd").format(Calendar.getInstance().getTime()));
        Admin admin = adminMapper.selectByPrimaryKey(1);
        System.out.println(admin.getUserName());
    }

    @Test
    public void testAdminMapper() {
        Admin admin = new Admin();
        // admin.setId(1);
        admin.setLoginAcct("zhangsan");
        admin.setUserName("张三");
        admin.setUserPswd("123456");
        admin.setEmail("zhangsan@tawe.com");
        admin.setCreateTime(new SimpleDateFormat("yyyy-MM-dd").format(Calendar.getInstance().getTime()));
        // adminMapper.insert(admin);
        // adminMapper.insert(admin);
        // adminMapper.insert(admin);
        // adminMapper.insert(admin);
        // adminMapper.insert(admin);
        // adminMapper.insert(admin);
        // adminMapper.insert(admin);
        // adminMapper.insert(admin);
        // adminMapper.insert(admin);
        //
        int i = adminMapper.insert(admin);
        System.out.println(i);
    }
}

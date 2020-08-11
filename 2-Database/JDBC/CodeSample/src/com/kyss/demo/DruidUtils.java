package com.kyss.demo;

import com.alibaba.druid.pool.DruidDataSourceFactory;
import org.apache.commons.dbutils.DbUtils;

import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

/**
 * @ClassName DruidUtils
 * @Description TODO
 * @Author davidt
 * @Date 7/17/2020 1:50 PM
 * @Version 1.0
 **/
public class DruidUtils {

    /**
     * 初始化连接池
     * 使用静态代码块进行初始化
     */
    private static DataSource dataSource;
    static {
        try(InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("jdbc.properties")) {
            Properties pros = new Properties();
            pros.load(is);
            dataSource = DruidDataSourceFactory.createDataSource(pros);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static DataSource getDataSource() {
        return dataSource;
    }
    /**
     * @return 返回一个连接
     * @throws SQLException
     */
    public static Connection getConnection() throws SQLException {

        Connection connection = dataSource.getConnection();
        return connection;
    }

    public static void closeConnection(Connection connection) {
        DbUtils.closeQuietly(connection);
    }
}

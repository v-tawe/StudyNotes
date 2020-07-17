package com.kyss.demo;

import com.mysql.cj.jdbc.Driver;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.sql.*;
import java.util.Properties;

/**
 * @ClassName Demo
 * @Description TODO
 * @Author davidt
 * @Date 7/16/2020 3:23 PM
 * @Version 1.0
 **/
public class Demo {

    @Test
    public void test1() throws Exception {

        InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("jdbc.properties");
        Properties props = new Properties();
        props.load(is);

        String url = props.getProperty("url");
        String user = props.getProperty("username");
        String password = props.getProperty("password");
        String driverStr = props.getProperty("driverClassName");

        Class clazz = Class.forName(driverStr);

        Driver driver = (Driver) clazz.getDeclaredConstructor().newInstance();
        DriverManager.registerDriver(driver);

        Connection connection = DriverManager.getConnection(url, user, password);
        System.out.println(connection);
        
        try (is; connection; PreparedStatement preparedStatement = connection.prepareStatement("SHOW DATABASES")) {
            // ... add parameters to the SQL query using PreparedStatement methods:
            //     setInt, setString, etc.
            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                ResultSetMetaData metaData = resultSet.getMetaData();
                int columnCount = metaData.getColumnCount();
                String columnName = metaData.getColumnName(1);
                String columnLabel = metaData.getColumnLabel(1);
                while (resultSet.next()) {
                    // ... do something with result set
                    System.out.print(resultSet.getRow());
                    System.out.println(resultSet.getString(1));
                }
            }
        } catch (SQLException e) {
            // ... handle SQL exception
            e.printStackTrace();
        }
    }
}

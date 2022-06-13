package com.kyss.demo;

import com.alibaba.druid.support.json.JSONUtils;
import com.kyss.demo.model.Admin;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.commons.dbutils.handlers.BeanHandler;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.dbutils.handlers.MapHandler;
import org.apache.commons.dbutils.handlers.MapListHandler;

import javax.sql.DataSource;
import java.lang.reflect.Field;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @ClassName DruidDemo
 * @Description TODO
 * @Author davidt
 * @Date 7/17/2020 11:11 AM
 * @Version 1.0
 **/
public class DruidDemo {

    public static void main(String[] args) {


        List<Admin> admins = null;
        try(Connection connection = DruidUtils.getConnection()) {
            QueryRunner queryRunner = new QueryRunner();

            ResultSetHandler<List<Admin>> res = new BeanListHandler<>(Admin.class);
            admins = queryRunner.query(connection, "SELECT * FROM admin", res);

            MapListHandler mapHandler = new MapListHandler();

            List<Map<String, Object>> maps = queryRunner.query(connection, "SELECT * FROM beauty", mapHandler);
            maps.forEach(map -> System.out.println(map));

        } catch (SQLException e) {
            e.printStackTrace();
        }
        admins.forEach(System.out::println);

    }

}

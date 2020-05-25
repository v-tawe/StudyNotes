package com.kyss.simple.mapper;

import com.kyss.simple.model.SysRole;
import com.kyss.simple.type.Enabled;
import org.apache.ibatis.session.SqlSession;
import org.junit.Assert;
import org.junit.Test;

import java.sql.Date;
import java.util.Calendar;

public class RoleMapperTest<T> extends BaseMapperTest<T> {

    private SqlSession sqlSession;
    private RoleMapper roleMapper;

//    @Before
//    public void before() {
//        sqlSession = getSqlSession();
//        roleMapper = sqlSession.getMapper(RoleMapper.class);
//    }
//
//    @After
//    public void after() {
//        sqlSession.rollback();
//        sqlSession.close();
//    }

    @Test
    public void testSelectById() {
        roleMapper = this.getMapper(RoleMapper.class);
        SysRole sysRole = roleMapper.selectById(2L);
        Assert.assertNotNull(sysRole);
        sysRole.setRoleName("TEST ROLE");
        SysRole sysRole3 = roleMapper.selectById(2L);
        Assert.assertEquals(sysRole, sysRole3);
        System.out.println("===new session here===");
        SqlSession sqlSession = initSqlSession();
        RoleMapper roleMapper2 = sqlSession.getMapper(RoleMapper.class);
        SysRole sysRole2 = roleMapper2.selectById(2L);
        Assert.assertEquals(sysRole.getRoleName(), sysRole2.getRoleName());
        //Assert.assertEquals(sysRole, sysRole2);
        sqlSession.rollback();
        sqlSession.close();
    }

    @Test
    public void testInsert() {
        RoleMapper roleMapper = this.getMapper(RoleMapper.class);
        SysRole sysRole = new SysRole();
        sysRole.setRoleName("testRole");
        sysRole.setEnabled(Enabled.enabled);
        sysRole.setCreateBy(1L);
        sysRole.setCreateTime(new Date(Calendar.getInstance().getTime().getTime()));
        int num = roleMapper.insert(sysRole);
        Assert.assertEquals(1, num);
        Assert.assertNotNull(sysRole.getId());

    }

    @Test
    public void testSelectRolePrivilegeById() {
        SysRole sysRole = roleMapper.selectRolePrivilegeById(2L);
        Assert.assertNotNull(sysRole);
    }

    @Test
    public void testSelectRolePrivilegeById2() {
        SysRole sysRole = roleMapper.selectRolePrivilegeById2(2L);
        Assert.assertNotNull(sysRole);
    }

}
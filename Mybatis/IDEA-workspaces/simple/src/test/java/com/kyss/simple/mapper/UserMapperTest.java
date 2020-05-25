package com.kyss.simple.mapper;

import com.kyss.simple.model.SysRole;
import com.kyss.simple.model.SysUser;
import com.kyss.simple.type.Enabled;
import org.apache.ibatis.session.SqlSession;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserMapperTest<T> extends BaseMapperTest<T> {

	@Test
	@Ignore
	public void testSelectById() {
		SqlSession sqlSession = getSqlSession();
		try {
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			SysUser sysUser = userMapper.selectById(1L);
			Assert.assertNotNull(sysUser);
			Assert.assertEquals("admin", sysUser.getUserName());
		} finally {
			sqlSession.close();
		}
	}
	@Test
	public void testSelectByUserName() {
		UserMapper usermapper = getMapper(UserMapper.class);
		SysUser sysUser = usermapper.selectByUserName("test");
		Assert.assertNotNull(sysUser);
	}

	@Test
	@Ignore
	public void testSelectRolesByUserId() {
	    SqlSession sqlSession = getSqlSession();
	    try {
	        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
	        List<SysRole> roleList = userMapper.selectRolesByUserId((long) 1);
	        Assert.assertNotNull(roleList);
	        Assert.assertTrue(roleList.size() > 0);
	    } finally {
	        sqlSession.close();
	    }
	}

	@Test
	@Ignore
	public void testSelectAll() {
		SqlSession sqlSession = getSqlSession();
		try {
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			List<SysUser> userList = userMapper.selectAll();
			Assert.assertNotNull(userList);
			Assert.assertTrue(userList.size() > 0);
		} finally {
			sqlSession.close();
		}
	}

	@Test
	@Ignore
	public void testInsert() {
		SqlSession sqlSession = getSqlSession();
		try {
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			SysUser user = new SysUser();
			user.setUserName("test1");
			user.setUserPassword("123456");
			user.setUserEmail("test@qq.com");
			user.setUserInfo("test info");
			user.setHeadImg(String.valueOf(new byte[] {1, 2, 3}));
			//user.setCreateTime(new Date(Calendar.getInstance().getTime().getTime()));
			
			int result = userMapper.insert3(user);
			Assert.assertEquals(1, result);
			Assert.assertNotNull(user.getId());
		} finally {
			sqlSession.rollback();
//			sqlSession.commit();
			sqlSession.close();
		}
	}
	
	@Test
	@Ignore
	public void testUpdateById() {
		SqlSession sqlSession = getSqlSession();
		try {
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			SysUser user = userMapper.selectById(1004L);
			Assert.assertEquals("test1", user.getUserName());
			user.setUserName("admin_test");
			int result = userMapper.updateById(user);
			Assert.assertEquals(1, result);
			user = userMapper.selectById(1004L);
			Assert.assertEquals("admin_test", user.getUserName());
		} finally {
			sqlSession.rollback();
//			sqlSession.commit();
			sqlSession.close();
		}
	}
	
	@Test
	@Ignore
	public void testDeleteById() {
		SqlSession sqlSession = getSqlSession();
		try {
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			SysUser user1 = userMapper.selectById(1L);
			Assert.assertNotNull(user1);
			int result = userMapper.deleteById(1L);
			Assert.assertEquals(1, result);
			
			SysUser user2 = userMapper.selectById(1001L);
			Assert.assertNotNull(user2);
			int result2 = userMapper.deleteById(user2);
			Assert.assertEquals(1, result2);
			Assert.assertNull(userMapper.selectById(1001L));
		} finally {
			sqlSession.rollback();
			sqlSession.close();
		}
	}
	
	@Test
	public void testSelectRolesByUserIdAndRoleEnabled() {
		SqlSession sqlSession = getSqlSession();
		try {
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			List<SysRole> userList = userMapper.selectRolesByUserIdAndRoleEnabled(1L,1);
			Assert.assertNotNull(userList);
			Assert.assertTrue(userList.size() > 0);
		} finally {
			sqlSession.close();
		}
	}
	
	@Test
	public void testSelectRolesByUserIdAndRoleEnabled2() {
		SqlSession sqlSession = getSqlSession();
		try {
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			SysUser user = new SysUser();
			user.setId(1L);
			SysRole role = new SysRole();
			role.setEnabled(Enabled.enabled);
			List<SysRole> userList = userMapper.selectRolesByUserIdAndRoleEnabled(user, role);
			Assert.assertNotNull(userList);
			Assert.assertTrue(userList.size() > 0);
		} finally {
			sqlSession.close();
		}
	}

	@Test
	public void testMyMapperProxy() {
		SqlSession sqlSession = getSqlSession();
		MyMapperProxy myMapperProxy = new MyMapperProxy(UserMapper.class, sqlSession);
//		UserMapper userMapper = (UserMapper) Proxy.newProxyInstance(Thread.currentThread().getContextClassLoader(), new Class[]{UserMapper.class}, myMapperProxy);
		UserMapper userMapper = (UserMapper) myMapperProxy.getProxy();
		List<SysUser> user = userMapper.selectAll();
	}

	@Test
	public void testUpdateByMap() {
//		SqlSession sqlSession = getSqlSession();
//		UserMapper userMapper = sqlSession.getMapper(UserMapper.class);

		UserMapper userMapper = this.getMapper(UserMapper.class);

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("id", 1L);
		map.put("user_email", "test@kyss.com");
		map.put("user_password", "123123");

		userMapper.updateByMap(map);
		SysUser user = userMapper.selectById(1L);
		Assert.assertEquals("test@kyss.com", user.getUserEmail());
	}

	@Test
	public void testSelectUserAndRoleById() {
		UserMapper userMapper = this.getMapper(UserMapper.class);
		SysUser sysUser = userMapper.selectUserAndRoleById(1001L);
		Assert.assertNotNull(sysUser);
		System.out.println("Haven't exec getSysRole() function");
		System.out.println("Haven't exec equals() function");
		sysUser.equals(null);
		System.out.println("Exec equals() function");
		Assert.assertNotNull(sysUser.getSysRole());
		sysUser.setUserName("New Name");
		SqlSession sqlSession = initSqlSession();
		UserMapper userMapper2 = sqlSession.getMapper(UserMapper.class);
		SysUser sysUser2 = userMapper2.selectUserAndRoleById(1001L);
		Assert.assertEquals(sysUser, sysUser2);
		sqlSession.rollback();
		sqlSession.close();
	}

	@Test
	public void testSelectUserAndRoleById2() {
		UserMapper userMapper = this.getMapper(UserMapper.class);
		// SysUser sysUser = userMapper.selectUserAndRoleById2(1001L);
		SysUser sysUser = userMapper.selectUserAndRoleById2(1L);
		Assert.assertNotNull(sysUser);
		System.out.println("Haven't exec getSysRole() function");
		System.out.println("Haven't exec equals() function");
		sysUser.equals(null);
		System.out.println("Exec equals() function");
		Assert.assertNotNull(sysUser.getRoleList());
		//Assert.assertNotNull(sysUser.getSysRole());
	}

	@Test
	public void testSelectUserById(){
		UserMapper userMapper = this.getMapper(UserMapper.class);
		SysUser sysUser = new SysUser();
		sysUser.setId(1L);
		userMapper.selectUserById(sysUser);
		Assert.assertNotNull(sysUser.getUserName());
		System.out.println("sysUser.name: " + sysUser.getUserName());
	}

	@Test
	public void testSelectUserPage() {
		UserMapper userMapper = this.getMapper(UserMapper.class);
		Map<String, Object> params = new HashMap<>();
		params.put("userName", "ad");
		params.put("offset", 0);
		params.put("limit", 10);
		List<SysUser> userList = userMapper.selectUserPage(params);
		Long total = (Long)params.get("total");
		System.out.println("Total: " + total);
		for (SysUser user : userList) {
			System.out.println("User: " + user.getUserName());
		}
	}

	@Test
	public void testInsertAndDelete() {
		UserMapper userMapper = this.getMapper(UserMapper.class);
		SysUser user = new SysUser();
		user.setUserName("test1");
		user.setUserPassword("123456");
		user.setUserEmail("test@mybatis.com");
		user.setUserInfo("test info");
		user.setHeadImg("{1, 2, 3}");
		userMapper.insertUserAndRoles(user, "1,2,3");
		Assert.assertNotNull(user.getId());
		Assert.assertNotNull(user.getCreateTime());
		SqlSession sqlSession = this.getSqlSession();
		sqlSession.commit();
		userMapper.deleteUserById(user.getId());
		sqlSession.commit();
	}

}

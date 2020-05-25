package com.kyss.simple.mapper;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;

import java.io.IOException;
import java.io.InputStream;

public class BaseMapperTest<T> {
	private static SqlSessionFactory sqlSessionFactory;

	private SqlSession sqlSession;

	public <T> T getMapper(Class<T> mapperClass) {
		return sqlSession.getMapper(mapperClass);
	}
	
	@Before
	public void before() {
		sqlSession = initSqlSession();
//		final UserMapper mapper = this.<UserMapper>getMapper(UserMapper.class);
	}

	@After
	public void after() {
		sqlSession.rollback();
		sqlSession.close();
	}
	
	@BeforeClass
	public static void init() {
		String resource = "mybatis-config.xml";
		InputStream inputStream;
		try {
			inputStream = Resources.getResourceAsStream(resource);
			sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
			inputStream.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public SqlSession getSqlSession() {
		return sqlSession;
	}
	public SqlSession initSqlSession() { return sqlSessionFactory.openSession(); }
}

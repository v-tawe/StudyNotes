package com.kyss.simple;

import java.util.List;

import com.kyss.simple.mapper.BaseMapperTest;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

import com.kyss.simple.model.Country;

public class CountryMapperTest extends BaseMapperTest {
//	private static SqlSessionFactory sqlSessionFactory;
//
//	@BeforeClass
//	public static void init() {
//		Reader reader = null;
//		try {
//			reader = Resources.getResourceAsReader("mybatis-config.xml");
//			sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader);
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} finally {
//			try {
//				if (reader != null) {
//					reader.close();
//				}
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//		}
//	}

	@Test
	public void testSelectAll() {
		SqlSession sqlSession = getSqlSession();
		try {
			List<Country> countryList = sqlSession.selectList("com.kyss.simple.mapper.CountryMapper.selectAll");
			printCountryList(countryList);
		} finally {
			sqlSession.close();
		}

	}

	private void printCountryList(List<Country> countryList) {
		for (Country country : countryList) {
			System.out.printf("%-4d%4s%4s\n",
						country.getId(),
						country.getCountryName(),
						country.getCountryCode());
		}
	}

}

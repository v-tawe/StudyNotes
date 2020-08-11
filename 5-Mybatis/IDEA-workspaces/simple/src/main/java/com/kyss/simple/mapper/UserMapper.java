package com.kyss.simple.mapper;

import com.kyss.simple.model.SysRole;
import com.kyss.simple.model.SysUser;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * @author davidt
 */
public interface UserMapper {
	SysUser selectById(Long id);
	SysUser selectByUserName(String userName);
	List<SysUser> selectAll();
	List<SysRole> selectRolesByUserId(Long userId);

	// no primary identity
	int insert(SysUser sysUser);
	// use keyProperty to get identity
	int insert2(SysUser sysUser);
	// use selectKey to get identity
	int insert3(SysUser sysUser);
	
	int updateById(SysUser sysUser);

	/**
	 * use foreach to construct SQL sentence
	 * @param map
	 * @return
	 */
	int updateByMap(@Param("map") Map<String, Object> map);
	
	int deleteById(Long id);
	int deleteById(SysUser sysUser);


	// multi-params
	List<SysRole> selectRolesByUserIdAndRoleEnabled(@Param("userId")Long userId, @Param("enabled")Integer enabled);
	List<SysRole> selectRolesByUserIdAndRoleEnabled(@Param("sysUser")SysUser sysUser, @Param("sysRole")SysRole sysRole);

	/**
	 * select User and role info by Id
	 * @param userId
	 * @return
	 */
	SysUser selectUserAndRoleById(Long userId);

	/**
	 * select User and roles by Id
	 * @param userId
	 * @return
	 */
	SysUser selectUserAndRoleById2(Long userId);

	/**
	 * select user info by userId
	 * @param user
	 */
	void selectUserById(SysUser user);

	/**
	 * select all user info by page
	 * @param params
	 * @return
	 */
	List<SysUser> selectUserPage(Map<String, Object> params);

	int insertUserAndRoles(@Param("user")SysUser user, @Param("roleIds")String roleIds);

	int deleteUserById(Long id);
}

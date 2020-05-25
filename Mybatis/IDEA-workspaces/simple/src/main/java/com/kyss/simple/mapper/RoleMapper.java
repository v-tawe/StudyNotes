package com.kyss.simple.mapper;

import com.kyss.simple.model.SysRole;
import org.apache.ibatis.annotations.CacheNamespaceRef;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;

/**
 * @author davidt
 */
@CacheNamespaceRef(RoleMapper.class)
public interface RoleMapper {
    /**
     * Select by ID
     * @param id
     * @return SysRole
     */

    SysRole selectById(Long id);

    /**
     * Insert one role
     * @param sysRole
     * @return influences num
     */
    @Insert("INSERT INTO sys_role(role_name, enabled, create_by, create_time) " +
            "VALUES(#{roleName}, #{enabled}, #{createBy}, #{createTime, jdbcType = TIMESTAMP});")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysRole sysRole);

    /**
     * select all privileges by role_id
     * @param id
     * @return
     */
    SysRole selectRolePrivilegeById(Long id);

    /**
     * select all privileges by role_id
     * @param id
     * @return
     */
    SysRole selectRolePrivilegeById2(Long id);
}

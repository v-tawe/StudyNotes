package com.kyss.simple.mapper;

import com.kyss.simple.mapper.provider.PrivilegeProvider;
import com.kyss.simple.model.SysPrivilege;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.List;

/**
 * @author davidt
 */
public interface PrivilegeMapper {

    /**
     * select privilege by id
     * @param id
     * @return
     */
    @SelectProvider(type= PrivilegeProvider.class, method = "selectById")
//    @Select("SELECT * FROM sys_privilege where id=#{id}")
    SysPrivilege selectById(Long id);

    /**
     * select privilege by id
     * @param id
     * @return
     */
     @Select("SELECT * FROM sys_privilege where id=#{id}")
    SysPrivilege selectById2(Long id);

    /**
     * select all privileges
     * @return
     */
    List<SysPrivilege> selectAll();
}



package com.kyss.simple.mapper;

import com.kyss.simple.model.SysPrivilege;
import org.junit.Test;

import java.util.List;

public class PrivilegeMapperTest<T> extends BaseMapperTest<T> {

    @Test
    public void selectById() {
        PrivilegeMapper privilegeMapper = this.getMapper(PrivilegeMapper.class);
        SysPrivilege sysPrivilege = privilegeMapper.selectById(1L);
    }

    @Test
    public void testSelectById() {
        PrivilegeMapper privilegeMapper = this.getMapper(PrivilegeMapper.class);
        List<SysPrivilege> sysPrivilegeList = privilegeMapper.selectAll();
    }
}
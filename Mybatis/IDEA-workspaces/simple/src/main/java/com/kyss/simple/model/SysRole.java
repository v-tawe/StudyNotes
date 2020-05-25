package com.kyss.simple.model;

import com.kyss.simple.type.Enabled;

import java.io.Serializable;
import java.sql.Date;
import java.util.List;

/**
 * @author davidt
 */
public class SysRole implements Serializable {
	private static final long serialVersionUID = 6320948592287478292L;

	private Long id;
	private String roleName;
	private Enabled enabled;
	private Long createBy;
	private Date createTime;
	
	private SysUser sysUser;

	private List<SysPrivilege> privilegeList;

	public List<SysPrivilege> getPrivilegeList() {
		return privilegeList;
	}

	public void setPrivilegeList(List<SysPrivilege> privilegeList) {
		this.privilegeList = privilegeList;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getRoleName() {
		return roleName;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	public Enabled getEnabled() {
		return enabled;
	}
	public void setEnabled(Enabled enabled) {
		this.enabled = enabled;
	}
	public Long getCreateBy() {
		return createBy;
	}
	public void setCreateBy(Long createBy) {
		this.createBy = createBy;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}


}

package com.atguigu.atcrowdfunding.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.atguigu.atcrowdfunding.bean.AJAXResult;
import com.atguigu.atcrowdfunding.bean.Permission;
import com.atguigu.atcrowdfunding.service.PermissionService;

@Controller
@RequestMapping("/permission")
public class PermissionController {

	@Autowired
	private PermissionService permissionService;

	@ResponseBody
	@RequestMapping("/delete")
	public Object delete( Permission permission ) {
		AJAXResult result = new AJAXResult();
		
		try {
			permissionService.deletePermission(permission);
			result.setSuccess(true);
		} catch ( Exception e ) {
			e.printStackTrace();
			result.setSuccess(false);
		}
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("/update")
	public Object update( Permission permission ) {
		AJAXResult result = new AJAXResult();
		
		try {
			permissionService.updatePermission(permission);
			result.setSuccess(true);
		} catch ( Exception e ) {
			e.printStackTrace();
			result.setSuccess(false);
		}
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("/insert")
	public Object insert( Permission permission ) {
		AJAXResult result = new AJAXResult();
		
		try {
			permissionService.insertPermission(permission);
			result.setSuccess(true);
		} catch ( Exception e ) {
			e.printStackTrace();
			result.setSuccess(false);
		}
		
		return result;
	}

	@RequestMapping("/add")
	public String add() {
		return "permission/add";
	}
	
	@RequestMapping("/edit")
	public String edit( Integer id, Model model ) {
		
		Permission permission = permissionService.queryById(id);
		model.addAttribute("permission", permission);
		
		return "permission/edit";
	}
	
	@RequestMapping("/index")
	public String index() {
		return "permission/index";
	}
	
	
	@ResponseBody
	@RequestMapping("/loadAssignData")
	public Object loadAssignData( Integer roleid ) {
		List<Permission> permissions = new ArrayList<Permission>();
		List<Permission> ps = permissionService.queryAll();
		
		// 获取当前角色已经分配的许可信息
		List<Integer> permissionids = permissionService.queryPermissionidsByRoleid(roleid);
		
		Map<Integer, Permission> permissionMap = new HashMap<Integer, Permission>();
		for (Permission p : ps) {
			if ( permissionids.contains(p.getId()) ) {
				p.setChecked(true);
			} else {
				p.setChecked(false);
			}
			permissionMap.put(p.getId(), p);
		}
		for ( Permission p : ps ) {
			Permission child = p;
			if ( child.getPid() == 0 ) {
				permissions.add(p);
			} else {
				Permission parent = permissionMap.get(child.getPid());
				parent.getChildren().add(child);
			}
		}
		
		return permissions;
	}
	
	@ResponseBody
	@RequestMapping("/loadData")
	public Object loadData() {
		List<Permission> permissions = new ArrayList<Permission>();
		
//		Permission root = new Permission();
//		root.setName("顶级节点");
//		
//		Permission child = new Permission();
//		child.setName("子节点");
//		
//		root.getChildren().add(child);
//		permissions.add(root);
		
		// 读取树形结构数据
		/*
		Permission root = permissionService.queryRootPermission();		
		
		List<Permission> childPermissions = permissionService.queryChildPermissions(root.getId());
		
		for ( Permission childPermission : childPermissions ) {
			List<Permission> childChildPermissions = permissionService.queryChildPermissions(childPermission.getId());
			childPermission.setChildren(childChildPermissions);
		}
		
		root.setChildren(childPermissions);
		
		permissions.add(root);
		*/
		
		// 递归查询数据
		/*
		Permission parent = new Permission();
		parent.setId(0);
		queryChildPermissions(parent);
		//permissions.
		return parent.getChildren();
		*/
		
		// 查询所有的许可数据
		List<Permission> ps = permissionService.queryAll();
		
		/*
		for ( Permission p : ps ) {
			// 子节点
			Permission child = p;
			if ( p.getPid() == 0 ) {
				permissions.add(p);
			} else {
				for ( Permission innerPermission : ps ) {
					if ( child.getPid().equals(innerPermission.getId()) ) {
						// 父节点
						Permission parent = innerPermission;
						// 组合父子节点的关系
						parent.getChildren().add(child);
						break;
					}
				}
			}
		}
		*/
		
		Map<Integer, Permission> permissionMap = new HashMap<Integer, Permission>();
		for (Permission p : ps) {
			permissionMap.put(p.getId(), p);
		}
		for ( Permission p : ps ) {
			Permission child = p;
			if ( child.getPid() == 0 ) {
				permissions.add(p);
			} else {
				Permission parent = permissionMap.get(child.getPid());
				parent.getChildren().add(child);
			}
		}
		
		return permissions;
	}
	
	/**
	 * 递归查询许可信息
	 * 1） 方法自己调用自己
	 * 2）方法一定要存在跳出逻辑
	 * 3）方法调用时，参数之间应该有规律
	 * 4） 递归算法，效率比较低
	 * @param parent
	 */
	private void queryChildPermissions( Permission parent ) {
		List<Permission> childPermissions = permissionService.queryChildPermissions(parent.getId());
		
		for ( Permission permission : childPermissions ) {
			queryChildPermissions(permission);
		}
		
		parent.setChildren(childPermissions);
	}
}

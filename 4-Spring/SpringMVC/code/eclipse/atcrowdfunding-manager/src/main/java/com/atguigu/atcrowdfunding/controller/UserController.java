package com.atguigu.atcrowdfunding.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.atguigu.atcrowdfunding.bean.AJAXResult;
import com.atguigu.atcrowdfunding.bean.Page;
import com.atguigu.atcrowdfunding.bean.Role;
import com.atguigu.atcrowdfunding.bean.User;
import com.atguigu.atcrowdfunding.service.RoleService;
import com.atguigu.atcrowdfunding.service.UserService;

@Controller
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserService userService;
	@Autowired
	private RoleService roleService;
	
	@ResponseBody
	@RequestMapping("/deletes")
	public Object deletes( Integer[] userid ) {
		AJAXResult result = new AJAXResult();
		
		try {
			
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("userids", userid);
			userService.deleteUsers(map);
			result.setSuccess(true);
		} catch ( Exception e ) {
			e.printStackTrace();
			result.setSuccess(false);
		}
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("/delete")
	public Object delete( Integer id ) {
		AJAXResult result = new AJAXResult();
		
		try {
			
			userService.deleteUserById(id);
			result.setSuccess(true);
		} catch ( Exception e ) {
			e.printStackTrace();
			result.setSuccess(false);
		}
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("/update")
	public Object update( User user ) {
		AJAXResult result = new AJAXResult();
		
		try {
			
			userService.updateUser(user);
			result.setSuccess(true);
		} catch ( Exception e ) {
			e.printStackTrace();
			result.setSuccess(false);
		}
		
		return result;
	}
	
	@RequestMapping("/edit")
	public String edit( Integer id, Model model ) {
		
		User user = userService.queryById(id);
		model.addAttribute("user", user);
		
		return "user/edit";
	}
	
	@RequestMapping("/assign")
	public String assign( Integer id, Model model ) {
		
		User user = userService.queryById(id);
		model.addAttribute("user", user);
		
		List<Role> roles = roleService.queryAll();
		
		List<Role> assingedRoles = new ArrayList<Role>();
		List<Role> unassignRoles = new ArrayList<Role>();
		
		// 获取关系表的数据
		List<Integer> roleids = userService.queryRoleidsByUserid(id);
		for ( Role role : roles ) {
			if ( roleids.contains(role.getId()) ) {
				assingedRoles.add(role);
			} else {
				unassignRoles.add(role);
			}
		}
		
		model.addAttribute("assingedRoles", assingedRoles);
		model.addAttribute("unassignRoles", unassignRoles);
		
		return "user/assign";
	}
	
	
	@ResponseBody
	@RequestMapping("/doAssign")
	public Object doAssign( Integer userid, Integer[] unassignroleids ) {
		AJAXResult result = new AJAXResult();
		
		try {
			// 增加关系表数据
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("userid", userid);
			map.put("roleids", unassignroleids);
			userService.insertUserRoles(map);
			result.setSuccess(true);
		} catch ( Exception e ) {
			e.printStackTrace();
			result.setSuccess(false);
		}
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("/dounAssign")
	public Object dounAssign( Integer userid, Integer[] assignroleids ) {
		AJAXResult result = new AJAXResult();
		
		try {
			// 删除关系表数据
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("userid", userid);
			map.put("roleids", assignroleids);
			userService.deleteUserRoles(map);
			result.setSuccess(true);
		} catch ( Exception e ) {
			e.printStackTrace();
			result.setSuccess(false);
		}
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("/insert")
	public Object insert( User user ) {
		AJAXResult result = new AJAXResult();
		
		try {
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			user.setCreatetime(sdf.format(new Date()));
			user.setUserpswd("123456");
			userService.insertUser(user);
			result.setSuccess(true);
		} catch ( Exception e ) {
			e.printStackTrace();
			result.setSuccess(false);
		}
		
		return result;
	}
	
	@RequestMapping("/add")
	public String add() {
		return "user/add";
	}
	
	@ResponseBody
	@RequestMapping("/pageQuery")
	public Object pageQuery( String queryText, Integer pageno, Integer pagesize ) {
		
		AJAXResult result = new AJAXResult();
		
		try {
			
			// 分页查询
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("start", (pageno-1)*pagesize);
			map.put("size", pagesize);
			map.put("queryText", queryText);
			
			List<User> users = userService.pageQueryData( map );
			// 当前页码			
			// 总的数据条数
			int totalsize = userService.pageQueryCount( map );
			// 最大页码（总页码）
			int totalno = 0;
			if ( totalsize % pagesize == 0 ) {
				totalno = totalsize / pagesize;
			} else {
				totalno = totalsize / pagesize + 1;
			}
			
			// 分页对象
			Page<User> userPage = new Page<User>();
			userPage.setDatas(users);
			userPage.setTotalno(totalno);
			userPage.setTotalsize(totalsize);
			userPage.setPageno(pageno);
			
			result.setData(userPage);
			result.setSuccess(true);
		} catch ( Exception e ) {
			e.printStackTrace();
			result.setSuccess(false);
		}
		
		return result;
		
	}
	
	@RequestMapping("/index")
	public String index() {
		return "user/index";
	}
	/**
	 * 用户首页
	 * @return
	 */
	@RequestMapping("/index1")
	public String index1( @RequestParam(required=false, defaultValue="1")Integer pageno, @RequestParam(required=false, defaultValue="2")Integer pagesize, Model model ) {
		
		// 分页查询
		// limit start, size
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("start", (pageno-1)*pagesize);
		map.put("size", pagesize);
		
		List<User> users = userService.pageQueryData( map );
		model.addAttribute("users", users);
		// 当前页码
		model.addAttribute("pageno", pageno);
		
		// 总的数据条数
		int totalsize = userService.pageQueryCount( map );
		// 最大页码（总页码）
		int totalno = 0;
		if ( totalsize % pagesize == 0 ) {
			totalno = totalsize / pagesize;
		} else {
			totalno = totalsize / pagesize + 1;
		}
		model.addAttribute("totalno", totalno);
		
		return "user/index";
	}
}

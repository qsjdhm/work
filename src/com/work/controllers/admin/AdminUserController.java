package com.work.controllers.admin;

import java.net.URLDecoder;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import sun.misc.BASE64Encoder;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.work.service.IArticleService;
import com.work.service.IBookService;
import com.work.service.ICommentService;
import com.work.service.ILinkService;
import com.work.service.ISortService;
import com.work.service.IUserService;
import com.work.util.Encryption;
import com.work.util.GenerateHtml;
import com.work.vo.TArticle;
import com.work.vo.TBook;
import com.work.vo.TLink;
import com.work.vo.TSort;
import com.work.vo.TComment;
import com.work.vo.TUser;


@Controller
@RequestMapping(value = "/userAction")
public class AdminUserController {
	
	// 如果需要使用文章的服务，要在此先声明
	@Resource(name = "articleService")
	private IArticleService<TArticle> articleService;  // 声明IArticleService
	public IArticleService<TArticle> getArticleService() {
		return articleService;
	}
	public void setArticleService(IArticleService<TArticle> articleService) {
		this.articleService = articleService;
	}
	
	@Resource(name = "bookService")
	private IBookService<TBook> bookService;  // 声明IBookService
	public IBookService<TBook> getBookService() {
		return bookService;
	}
	public void setBookService(IBookService<TBook> bookService) {
		this.bookService = bookService;
	}
	
	@Resource(name = "linkService")
	private ILinkService<TLink> linkService;  // 声明ILinkService
	public ILinkService<TLink> getLinkService() {
		return linkService;
	}
	public void setLinkService(ILinkService<TLink> linkService) {
		this.linkService = linkService;
	}
	
	@Resource(name = "sortService")
	private ISortService<TSort> sortService;  // 声明ISortService
	public ISortService<TSort> getSortService() {
		return sortService;
	}
	public void setSortService(ISortService<TSort> sortService) {
		this.sortService = sortService;
	}
	
	@Resource(name = "commentService")
	private ICommentService<TComment> commentService;  // 声明ITCommentService
	public ICommentService<TComment> getCommentService() {
		return commentService;
	}
	public void setCommentService(ICommentService<TComment> commentService) {
		this.commentService = commentService;
	}
	
	@Resource(name = "userService")
	private IUserService<TUser> userService;  // 声明ITUserService
	public IUserService<TUser> getUserService() {
		return userService;
	}
	public void setUserService(IUserService<TUser> userService) {
		this.userService = userService;
	}
	
	
	
	
	/****************供AJAX请求的ACTION******************/
	
	@RequestMapping(value = "/getUserCount")
	public void getUserCount(HttpServletRequest request, HttpServletResponse response) throws Exception{
		String name = URLDecoder.decode(URLDecoder.decode(request.getParameter("name"), "utf-8"), "utf-8");
		// 做一下新老接口数据参数兼容
	    if (name == null || name == "") {
	    	name = "";
	    }
		int count = userService.getUserLength(name);
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取用户个数成功");
		jsonObject.put("data", count);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getUserList")
	public void getUserList(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String name = URLDecoder.decode(URLDecoder.decode(request.getParameter("name"), "utf-8"), "utf-8");
		// 做一下新老接口数据参数兼容
	    if (name == null || name == "") {
	    	name = "";
	    }
		int page = Integer.parseInt(request.getParameter("page"));
		int size = Integer.parseInt(request.getParameter("size"));
		String seq = request.getParameter("seq");
		String desc = request.getParameter("desc");
		// 做一下新老接口数据参数兼容
	    if (seq == null || seq == "") {
	    	seq = "Link_ID";
	    }
	    if (desc == null || desc == "") {
	    	desc = "desc";
	    }
		
		List <TUser> users = userService.getUser(page, 20, name, seq, desc);
		
		JSONArray userJsonArray = new JSONArray();
		for(int i=0; i<users.size(); i++){
			JSONObject userJson = new JSONObject();
			TUser user = users.get(i);
			userJson.put("User_ID", user.getUser_ID());
			userJson.put("User_Account", user.getUser_Account());
			userJson.put("User_Email", user.getUser_Email());
			userJson.put("User_Avatar", user.getUser_Avatar());
			
			userJsonArray.add(userJson);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取用户列表成功");
		jsonObject.put("data", userJsonArray);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/addUser")
	public void addUser(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String account = URLDecoder.decode(URLDecoder.decode(request.getParameter("name"), "utf-8"), "utf-8");
		String password = URLDecoder.decode(URLDecoder.decode(request.getParameter("password"), "utf-8"), "utf-8");
		String email = URLDecoder.decode(URLDecoder.decode(request.getParameter("email"), "utf-8"), "utf-8");
		
		// 1.处理密码
		Encryption enc = new Encryption();
		password = enc.encryption(password);
		
		// 2.添加用户数据
		TUser user = new TUser();
		user.setUser_Account(account);
		user.setUser_Password(password);
		user.setUser_Email(email);
		userService.create(user);
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "添加用户成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	@RequestMapping(value = "/delUser")
	public void delUser(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String selectId = request.getParameter("selectId");
		
		for(int i=0; i<selectId.split(";").length; i++){
			TUser user = new TUser();
			user.setUser_ID(Integer.parseInt(selectId.split(";")[i]));
			userService.delete(user);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "删除用户成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getUser")
	public void getUser(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int selectId = Integer.parseInt(request.getParameter("selectId"));
		
		// 1.根据链接id获取链接内容
		TUser user = userService.getUserByID(selectId);
		String account = user.getUser_Account();
		String email = user.getUser_Email();
		String avatar = user.getUser_Avatar();
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取用户成功");
		jsonObject.put("id", selectId);
		jsonObject.put("name", account);
		jsonObject.put("email", email);
		jsonObject.put("avatar", avatar);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/updateUser")
	public void updateUser(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id = Integer.parseInt(request.getParameter("id"));
		String account = URLDecoder.decode(URLDecoder.decode(request.getParameter("name"), "utf-8"), "utf-8");
		String password = URLDecoder.decode(URLDecoder.decode(request.getParameter("password"), "utf-8"), "utf-8");
		String email = URLDecoder.decode(URLDecoder.decode(request.getParameter("email"), "utf-8"), "utf-8");
		String avatar = request.getParameter("avatar");
		
		if(password.equals("")){
			// 首先取回需要修改的分类的数据
			TUser priUser = userService.getUserByID(id);
			password = priUser.getUser_Password();
		}else{
			// 1.处理密码
			Encryption enc = new Encryption();
			password = enc.encryption(password);
		}
		
		if(avatar == null || avatar.equals("")){
			// 首先取回需要修改的分类的数据
			TUser priUser = userService.getUserByID(id);
			avatar = priUser.getUser_Avatar();
		}
		
		// 2.修改用户数据
		TUser user = new TUser();
		user.setUser_ID(id);
		user.setUser_Account(account);
		user.setUser_Password(password);
		user.setUser_Email(email);
		user.setUser_Avatar(avatar);
		userService.update(user);
		
		// 2.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "修改用户成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
}
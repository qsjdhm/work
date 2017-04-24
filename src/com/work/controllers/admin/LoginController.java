package com.work.controllers.admin;

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.work.service.IUserService;
import com.work.util.Encryption;
import com.work.util.OperateLoginUser;
import com.work.vo.TUser;

@Controller
@RequestMapping(value = "/loginAction")
public class LoginController {
	
	@Resource(name = "userService")
	private IUserService<TUser> userService;  // 声明ITUserService
	public IUserService<TUser> getUserService() {
		return userService;
	}
	public void setUserService(IUserService<TUser> userService) {
		this.userService = userService;
	}
	
	@RequestMapping(value = "")
	public void login(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id = 0;
		String name = URLDecoder.decode(URLDecoder.decode(request.getParameter("name"), "utf-8"), "utf-8");
		String password = URLDecoder.decode(URLDecoder.decode(request.getParameter("password"), "utf-8"), "utf-8");
		
		// 1.处理密码
		Encryption enc = new Encryption();
		password = enc.encryption(password);
		
		response.setCharacterEncoding("UTF-8");
		JSONObject jsonObject = new JSONObject();
		
		// 验证用户是否存在
		List <TUser> users = userService.getUser(0, 10000, name, "User_ID", "desc");
		
		int aFlag = 0;
		int pFlag = 0;
		TUser successUser = new TUser();
		int size = users.size();
		for(int i=0; i<size; i++){
			TUser user = users.get(i);
			
			if(user.getUser_Account().equals(name)){
				if(user.getUser_Password().equals(password)){  // 成功
					id = user.getUser_ID();
					aFlag = 0;  // 账号正确
					pFlag = 0;  // 密码正确
					System.out.println("login:"+request.getSession().getId());
					user.setSessionId(request.getSession().getId());
					// 更新用户最新token
					userService.updateUserToken(id);
					successUser = user;
					break;
				}else{  // 密码错误
					aFlag = 0;
					pFlag = 1;  // 密码错误
					break;
				}
			}else{  // 账号错误
				aFlag = 1;  // 账号错误
				pFlag = 0;
			}
		}
		
		if(aFlag==0 && pFlag == 0){  // 成功
			TUser user = userService.getUserByID(id);
			
			JSONObject userObject = new JSONObject();
			userObject.put("id", user.getUser_ID());
			userObject.put("name", user.getUser_Account());
			userObject.put("email", user.getUser_Email());
			userObject.put("avatar", user.getUser_Avatar());
			userObject.put("token", user.getUser_Token());
			
			jsonObject.put("success", "1");
			jsonObject.put("msg", "登陆成功");
			jsonObject.put("user", userObject);
			OperateLoginUser.setUserId(successUser.getSessionId(), String.valueOf(1));
		}else if(aFlag!=0){  // 账号错误
			jsonObject.put("success", "-1");
			jsonObject.put("msg", "账户名错误");
		}else if(pFlag!=0){  // 密码错误
			jsonObject.put("success", "-1");
			jsonObject.put("msg", "密码错误");
		}else if(pFlag!=0){  // 密码错误
			jsonObject.put("success", "-1");
			jsonObject.put("msg", "账户名和密码错误");
		}
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
}
package com.work.controllers.admin;



import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.work.util.OperateFile;


@Controller
@RequestMapping(value = "/backupAction")
public class DataBackupController {
	
	 
	@RequestMapping(value = "/getBackupList")
	public void getBackupList(HttpServletRequest request, HttpServletResponse response) throws Exception{
		int startDate = request.getParameter("startDate").equals("") ? 0 : Integer.parseInt(request.getParameter("startDate"));
		int endDate = request.getParameter("endDate").equals("") ? 99999999 : Integer.parseInt(request.getParameter("endDate"));
		int page = Integer.parseInt(request.getParameter("page"));
		int size = Integer.parseInt(request.getParameter("size"));
		
		OperateFile operateFile = new OperateFile();
		
		// 获取文件路径
		String classPath = this.getClass().getResource("/").getPath();
        String filePath = classPath.split("WEB-INF")[0] + "backupFile";
        
        JSONObject backupJsonObject = operateFile.getAllFiles(filePath, startDate, endDate, page, size);
        
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取备份列表成功");
		jsonObject.put("data", backupJsonObject.getJSONArray("data"));
		jsonObject.put("count", backupJsonObject.get("count"));
		
		response.setContentType("text/html;charset=utf-8");
		response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/delBackup")
	public void delBackup(HttpServletRequest request, HttpServletResponse response) throws Exception{
		String selectId = request.getParameter("selectId");
		
		OperateFile operateFile = new OperateFile();
		// 获取文件路径
		String classPath = this.getClass().getResource("/").getPath();
        String filePath = classPath.split("WEB-INF")[0] + "backupFile";
        
        boolean isDel = operateFile.delFiles(filePath, selectId);
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		if (isDel) {
			jsonObject.put("success", "1");
			jsonObject.put("msg", "删除备份成功");
		} else {
			jsonObject.put("success", "0");
			jsonObject.put("msg", "删除备份失败");
		}
		
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	
	
	
	
	
	
	
	
}
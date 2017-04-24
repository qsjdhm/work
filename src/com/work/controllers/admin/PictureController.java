package com.work.controllers.admin;



import java.io.File;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.work.util.OperateImage;


@Controller
@RequestMapping(value = "/pictureAction")
public class PictureController {
	
	 
	@RequestMapping(value = "/getPictureList")
	public void getBackupList(HttpServletRequest request, HttpServletResponse response) throws Exception{
		int type = Integer.parseInt(request.getParameter("type"));
		int startDate = request.getParameter("start").equals("") ? 0 : Integer.parseInt(request.getParameter("start"));
		int endDate = request.getParameter("end").equals("") ? 99999999 : Integer.parseInt(request.getParameter("end"));
		int page = Integer.parseInt(request.getParameter("page"));
		int size = Integer.parseInt(request.getParameter("size"));
		
		OperateImage operateImage = new OperateImage();
		
		// 获取文件路径
		String classPath = this.getClass().getResource("/").getPath();
        String filePath = "";
        if (type == 1) {
        	// 文章图片
        	///work/WebContent/admin/src/assets/ueditor1.6.1/jsp/upload/20170424
        	filePath = classPath.split("WEB-INF")[0] + "admin" + File.separator + "src" + File.separator + "assets" + File.separator + "ueditor1.6.1" + File.separator + "jsp" + File.separator + "upload";
        } else {
        	// 图书图片
        	filePath = classPath.split("WEB-INF")[0] + "admin" + File.separator + "uploads";
        }
        
        JSONObject backupJsonObject = operateImage.getAllFiles(filePath, startDate, endDate, page, size);
        
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取图片列表成功");
		jsonObject.put("data", backupJsonObject.getJSONArray("data"));
		jsonObject.put("count", backupJsonObject.get("count"));
		
		response.setContentType("text/html;charset=utf-8");
		response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/delPicture")
	public void delBackup(HttpServletRequest request, HttpServletResponse response) throws Exception{
		String selectId = request.getParameter("selectId");
		
		OperateImage operateImage = new OperateImage();
		// 获取文件路径
		String classPath = this.getClass().getResource("/").getPath();
        String filePath = classPath.split("WEB-INF")[0] + "backupFile";
        
        boolean isDel = operateImage.delFiles(filePath, selectId);
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		if (isDel) {
			jsonObject.put("success", "1");
			jsonObject.put("msg", "删除图片成功");
		} else {
			jsonObject.put("success", "0");
			jsonObject.put("msg", "删除图片失败");
		}
		
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	
	
	
	
	
	
	
	
}
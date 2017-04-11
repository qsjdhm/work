package com.work.controllers.admin;

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import com.work.util.GenerateHtml;
import com.work.util.HtmlRegexp;
import com.work.vo.TArticle;
import com.work.vo.TBook;
import com.work.vo.TLink;
import com.work.vo.TSort;
import com.work.vo.TComment;
import com.work.util.OperateEmail;


@Controller
@RequestMapping(value = "/commentAction")
public class AdminCommentController {
	
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
	
	
	/****************供AJAX请求的ACTION******************/
	
	@RequestMapping(value = "/getCommentCount")
	public void getCommentCount(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String type = request.getParameter("type");
		String startTime = request.getParameter("start");
		String endTime = request.getParameter("end");
		int count = commentService.getCommentLength(type, startTime, endTime);
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取评论个数成功");
		jsonObject.put("data", count);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getUnreadCommentLength")
	public void getUnreadCommentLength(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int count = commentService.getUnreadCommentLength();
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取未读评论个数成功");
		jsonObject.put("data", count);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getCommentList")
	public void getCommentList(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String type  = request.getParameter("type");
		String startTime = request.getParameter("start");
		String endTime = request.getParameter("end");
		String seq = request.getParameter("seq");
		String desc = request.getParameter("desc");
		// 做一下新老接口数据参数兼容
	    if (seq == null || seq == "") {
	    	seq = "Comment_Time";
	    }
	    if (desc == null || desc == "") {
	    	desc = "desc";
	    }
		int page = Integer.parseInt(request.getParameter("page"));
		int size = Integer.parseInt(request.getParameter("size"));
		List <Map<String,Object>> commentList = commentService.getCommentList(type, startTime, endTime, seq, desc, page, size);
		
		JSONArray commentJsonArray = new JSONArray();
		for(int i=0; i<commentList.size(); i++){
			JSONObject commentJson = new JSONObject();
			Map <String,Object> comment = commentList.get(i);
			
			commentJson.put("Comment_ID", comment.get("Comment_ID").toString());
			commentJson.put("Comment_Person_Name", comment.get("Comment_Person_Name").toString());
			commentJson.put("Comment_Person_Email", comment.get("Comment_Person_Email").toString());
			commentJson.put("Comment_Content", comment.get("Comment_Content").toString());
			commentJson.put("Comment_Time", comment.get("Comment_Time").toString());
			commentJson.put("Comment_ArticleID", comment.get("Comment_ArticleID").toString());
			commentJson.put("Comment_ArticleTitle", comment.get("Comment_ArticleTitle").toString());
			commentJson.put("Parent_CommentID", comment.get("Parent_CommentID").toString());
			commentJson.put("Comment_Read", comment.get("Comment_Read").toString());
			
			commentJsonArray.add(commentJson);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取评论列表成功");
		jsonObject.put("data", commentJsonArray);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	

	/*
	 * 功能：根据文章ID，获取此文章下的评论数据
	 * 参数：id  文章ID
	 * 返回：json数据
	 */
	@RequestMapping(value="/getCommentByArticle", method = {RequestMethod.POST})
	public void getCommentByArticle(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id= Integer.parseInt(request.getParameter("id"));
		
		// 调用服务查询出评论数据
		List <TComment> comments = commentService.getCommentByArticleID(id);
		JSONArray commentJsonArray = new JSONArray();
		if(comments!=null){
			int size = comments.size();
			for(int i=0; i<size; i++){
				JSONObject commentJson = new JSONObject();
				TComment pComment = comments.get(i);
				commentJson.put("Comment_ID", pComment.getComment_ID());
				commentJson.put("Comment_Person_Name", pComment.getComment_Person_Name());
				commentJson.put("Comment_Time", pComment.getComment_Time());
				commentJson.put("Parent_CommentID", pComment.getParent_CommentID());
				commentJson.put("Comment_Content", pComment.getComment_Content());
				commentJson.put("Comment_Read", pComment.getComment_Read());
				
				commentJsonArray.add(commentJson);
			}
		}
		
		response.setCharacterEncoding("UTF-8");
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("data", commentJsonArray);
		
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/addComment")
	public void addComment(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String name = URLDecoder.decode(URLDecoder.decode(request.getParameter("name"), "utf-8"), "utf-8");
		String email = URLDecoder.decode(URLDecoder.decode(request.getParameter("email"), "utf-8"), "utf-8");
		String content = URLDecoder.decode(URLDecoder.decode(request.getParameter("content"), "utf-8"), "utf-8");
		String date = "";
		int articleID = Integer.parseInt(request.getParameter("articleID"));
		String articleTitle = URLDecoder.decode(URLDecoder.decode(request.getParameter("articleTitle"), "utf-8"), "utf-8");
		int fCommentID = Integer.parseInt(request.getParameter("fCommentID"));
		
		if (fCommentID != 0) {
			// 此种情况表明是回复邮件
			OperateEmail oEmail = new OperateEmail();
			TComment fComment = commentService.updateCommentUnread(fCommentID);
			String fName = fComment.getComment_Person_Name();
			String fEmail = fComment.getComment_Person_Email();
			int fArticleID = fComment.getComment_ArticleID();
			String emailContent = content + 
					"<br/><br/><a href='http://www.52doit.com/show/"+fArticleID+"'>点击回复他</a>";
			
			oEmail.sendEmail("qsjdhm@163.com", fName, "z0000000", fEmail, emailContent);
		}

		// 处理时间
		SimpleDateFormat pSMDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		date = pSMDate.format(new Date());
		
		// 1.添加评论数据
		TComment comment = new TComment();
		comment.setComment_Person_Name(name);
		comment.setComment_Person_Email(email);
		comment.setComment_Content(content);
		comment.setComment_Time(date);
		comment.setComment_ArticleID(articleID);
		comment.setComment_ArticleTitle(articleTitle);
		comment.setComment_Read(0);
		comment.setParent_CommentID(fCommentID);
		commentService.create(comment);
		
		// 2.获取当前添加评论的id
		int nowCommentID = 0;
		String nowCommentName = "";
		String nowCommentContent = "";
		String nowCommentTime = "";
		List <TComment> comments = commentService.getComment(0, 1);
		int size = comments.size();
		for(int i=0; i<size; i++){
			TComment nowComment = comments.get(i);
			nowCommentID = nowComment.getComment_ID();
			nowCommentName = nowComment.getComment_Person_Name();
			nowCommentContent = nowComment.getComment_Content();
			nowCommentTime = nowComment.getComment_Time();
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("nowCommentID", nowCommentID);
		jsonObject.put("nowCommentName", nowCommentName);
		jsonObject.put("nowCommentContent", nowCommentContent);
		jsonObject.put("nowCommentTime", nowCommentTime);
		jsonObject.put("msg", "添加评论成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/delComment")
	public void delComment(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String selectId = request.getParameter("selectId");
		
		for(int i=0; i<selectId.split(";").length; i++){
			TComment comment = new TComment();
			comment.setComment_ID(Integer.parseInt(selectId.split(";")[i]));
			commentService.delete(comment);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "删除评论成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getComment")
	public void getComment(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int selectId = Integer.parseInt(request.getParameter("selectId"));
		
		// 1.请求一次后就表示此评论看过了，所以要设为已读
		TComment comment = commentService.updateCommentUnread(selectId);
		
		// 2.根据评论id获取评论内容
		//TComment comment = commentService.getCommentByID(selectId);
		String userName = comment.getComment_Person_Name();
		String content = comment.getComment_Content();
		int read = comment.getComment_Read();
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取评论成功");
		jsonObject.put("id", selectId);
		jsonObject.put("userName", userName);
		jsonObject.put("content", content);
		jsonObject.put("read", read);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/updateComment")
	public void updateComment(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id = Integer.parseInt(request.getParameter("id"));
		String userName = URLDecoder.decode(URLDecoder.decode(request.getParameter("userName"), "utf-8"), "utf-8");
		String email = "";
		String content = URLDecoder.decode(URLDecoder.decode(request.getParameter("content"), "utf-8"), "utf-8");
		String date = "";
		int articleID = 0;
		String articleTitle = "";
		int parentId = 0;
		int read = 0;
		
		// 首先取回需要修改的评论的数据
		TComment priComment = commentService.getCommentByID(id);
		email = priComment.getComment_Person_Email();
		date = priComment.getComment_Time();
		articleID = priComment.getComment_ArticleID();
		articleTitle = priComment.getComment_ArticleTitle();
		parentId = priComment.getParent_CommentID();
		read = priComment.getComment_Read();
		
		// 1.修改评论数据
		TComment comment = new TComment();
		comment.setComment_ID(id);
		comment.setComment_Person_Name(userName);
		comment.setComment_Person_Email(email);
		comment.setComment_Content(content);
		comment.setComment_Time(date);
		comment.setComment_ArticleID(articleID);
		comment.setComment_ArticleTitle(articleTitle);
		comment.setComment_Read(read);
		comment.setParent_CommentID(parentId);
		commentService.update(comment);
		
		
		// 2.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "修改评论成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
}
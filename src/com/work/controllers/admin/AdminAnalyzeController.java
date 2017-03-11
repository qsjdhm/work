package com.work.controllers.admin;

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import com.work.util.ENV;

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
import com.work.util.OperateImage;
import com.work.util.OperateString;
import com.work.vo.TArticle;
import com.work.vo.TBook;
import com.work.vo.TLink;
import com.work.vo.TSort;
import com.work.vo.TComment;


@Controller
@RequestMapping(value = "/analyzeAction")
public class AdminAnalyzeController {
	 
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
	

	/*
	 * 功能：获取系统整个数据信息
	 * 参数：
	 * 返回：json数据
	 */
	@RequestMapping(value="/getAnalyzeCount", method = {RequestMethod.POST})
	public void getAnalyzeCount(HttpServletRequest request, HttpServletResponse response) throws Exception{
		// 获取各个表的总数据
		int articleCount = 1100+articleService.getArticleCount(0, "");
		int noteCount    = 6000+articleService.getNoteCount(0, "");
		int commentCount = 25000+commentService.getCommentLength();
		int bookCount    = 50+bookService.getBookLength(0);
		
		JSONObject countJson = new JSONObject();
		countJson.put("articleCount", articleCount);
		countJson.put("noteCount", noteCount);
		countJson.put("commentCount", commentCount);
		countJson.put("bookCount", bookCount);
		countJson.put("articleTendency", "-12%");
		countJson.put("noteTendency", "68%");
		countJson.put("commentTendency", "24%");
		countJson.put("bookTendency", "-3%");
		
		response.setCharacterEncoding("UTF-8");
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("countData", countJson);
		
		response.getWriter().print(jsonObject); 
	}
	
	
	
}
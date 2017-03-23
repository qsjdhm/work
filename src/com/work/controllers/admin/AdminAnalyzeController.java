package com.work.controllers.admin;

import java.math.BigDecimal;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

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
		int articleCount = articleService.getArticleCount(0, "");
		int noteCount    = articleService.getNoteCount(0, "");
		int commentCount = commentService.getCommentLength();
		int bookCount    = bookService.getBookLength(0);
		
		// 计算环比
		String articleTendency = "";
		String noteTendency = "";
		String commentTendency = "";
		String bookTendency = "37%";
		
		List <Map<String,Object>> articleList = articleService.getArticleDistribution("article");
		List <Map<String,Object>> noteList = articleService.getArticleDistribution("note");
		List <Map<String,Object>> commentList = commentService.getCommentDistribution();
		
		
		// 文章环比
		Map<String, Object> beforeArticle = articleList.get(articleList.size() - 2);
		Map<String, Object> lastArticle = articleList.get(articleList.size() - 1);
		double beforeArticleValue = (double)Integer.parseInt(beforeArticle.get("count").toString());
		double lastArticleValue = (double)Integer.parseInt(lastArticle.get("count").toString());
		if (((lastArticleValue/beforeArticleValue) * 100) < 100) {
			articleTendency = "-" + String.format("%.2f", (lastArticleValue/beforeArticleValue) * 100) + "%";
		} else {
			articleTendency = String.format("%.2f", (lastArticleValue/beforeArticleValue) * 100) + "%";
		}
		
		// 笔记环比
		Map<String, Object> beforeNote = noteList.get(noteList.size() - 2);
		Map<String, Object> lastNote = noteList.get(noteList.size() - 1);
		double beforeNoteValue = (double)Integer.parseInt(beforeNote.get("count").toString());
		double lastNoteValue = (double)Integer.parseInt(lastNote.get("count").toString());
		if (((lastNoteValue/beforeNoteValue) * 100) < 100) {
			noteTendency = "-" + String.format("%.2f", (lastNoteValue/beforeNoteValue) * 100) + "%";
		} else {
			noteTendency = String.format("%.2f", (lastNoteValue/beforeNoteValue) * 100) + "%";
		}
		
		// 评论环比
		Map<String, Object> beforeComment = commentList.get(commentList.size() - 2);
		Map<String, Object> lastComment = commentList.get(commentList.size() - 1);
		double beforeCommentValue = (double)Integer.parseInt(beforeComment.get("count").toString());
		double lastCommentValue = (double)Integer.parseInt(lastComment.get("count").toString());
		if (((lastCommentValue/beforeCommentValue) * 100) < 100) {
			commentTendency = "-" + String.format("%.2f", (lastCommentValue/beforeCommentValue) * 100) + "%";
		} else {
			commentTendency = String.format("%.2f", (lastCommentValue/beforeCommentValue) * 100) + "%";
		}
		
		
		
		JSONObject countJson = new JSONObject();
		countJson.put("articleCount", articleCount);
		countJson.put("noteCount", noteCount);
		countJson.put("commentCount", commentCount);
		countJson.put("bookCount", bookCount);
		countJson.put("articleTendency", articleTendency);
		countJson.put("noteTendency", noteTendency);
		countJson.put("commentTendency", commentTendency);
		countJson.put("bookTendency", bookTendency);
		
		response.setCharacterEncoding("UTF-8");
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("countData", countJson);
		
		response.getWriter().print(jsonObject); 
	}
	
	/*
	 * 功能：获取系统整个数据的分布情况
	 * 参数：type 哪个表数据
	 * 返回：json数据
	 */
	@RequestMapping(value="/getDataDistribution", method = {RequestMethod.POST})
	public void getDataDistribution(HttpServletRequest request, HttpServletResponse response) throws Exception{
		String type = request.getParameter("type");
		JSONArray dataJsonArray = new JSONArray();
		List <Map<String,Object>> mapList = null;
		if (type.equals("article") || type.equals("note")) {
			mapList = articleService.getArticleDistribution(type);
		} else if (type.equals("comment")) {
			mapList = commentService.getCommentDistribution();
		} else if (type.equals("book")) {
			mapList = bookService.getBookDistribution();
		}
		
		int total = 0;
		int length = 0;
		
		for(int i=0; i<mapList.size(); i++, length++){
			JSONObject itemJson = new JSONObject();
			Map<String,Object> map = mapList.get(i);

			itemJson.put("date", map.get("cycle"));
			itemJson.put("count", map.get("count"));
			
			// 计算合计
			total += Integer.parseInt(map.get("count").toString());
			
			dataJsonArray.add(itemJson);
		}
		
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取分析数据成功");
		jsonObject.put("data", dataJsonArray);
		jsonObject.put("total", total);
		jsonObject.put("monthly", Math.round(total/length));
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	
}
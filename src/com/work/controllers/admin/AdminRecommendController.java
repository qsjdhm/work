package com.work.controllers.admin;

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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


@Controller
@RequestMapping(value = "/recommendAction")
public class AdminRecommendController {
	
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
	
	@Resource(name = "sortService")
	private ISortService<TSort> sortService;  // 声明ISortService
	public ISortService<TSort> getSortService() {
		return sortService;
	}
	public void setSortService(ISortService<TSort> sortService) {
		this.sortService = sortService;
	}
	
	
	
	/****************供AJAX请求的ACTION******************/
	
	@RequestMapping(value = "/getArticle")
	public void getArticle(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int selectId = Integer.parseInt(request.getParameter("selectId"));
		
		// 1.根据文章id获取文章内容
		TArticle article = articleService.getArticleByID(selectId);
		int readNum = article.getRead_Num();
		int recommendNum = article.getRecommend_Num();
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取推荐数据成功");
		jsonObject.put("id", selectId);
		jsonObject.put("readNum", readNum);
		jsonObject.put("recommendNum", recommendNum);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	@RequestMapping(value = "/getBook")
	public void getBook(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int selectId = Integer.parseInt(request.getParameter("selectId"));
		
		// 1.根据笔记id获取图书内容
		TBook book = bookService.getBookByID(selectId);
		int downNum = book.getDownload_Num();
		int recommendNum = book.getRecommend_Num();
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取推荐数据成功");
		jsonObject.put("id", selectId);
		jsonObject.put("downNum", downNum);
		jsonObject.put("recommendNum", recommendNum);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	@RequestMapping(value = "/recommendArticle")
	public void recommendArticle(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id = Integer.parseInt(request.getParameter("id"));
		String title = "";
		String date = "";
		String cover = "";
		String content = "";
		String tags = "";
		int sortId = 0;
		String sortName = "";
		int fSortId = 0;
		int recommendNum = Integer.parseInt(request.getParameter("recommendNum"));
		int readNum = Integer.parseInt(request.getParameter("readNum"));
		
		// 首先取回需要修改的这篇文章的数据
		TArticle priArticle = articleService.getArticleByID(id);
		title = priArticle.getArticle_Title();
		date = priArticle.getArticle_Date();
		cover = priArticle.getArticle_Cover();
		content = priArticle.getArticle_Content();
		tags = priArticle.getArticle_Tag();
		sortId = priArticle.getSort_ID();
		sortName = priArticle.getSort_Name();
		fSortId = priArticle.getF_Sort_ID();
		
		
		// 1.修改文章数据
		TArticle article = new TArticle();
		article.setArticle_ID(id);
		article.setArticle_Title(title);
		article.setArticle_Date(date);
		article.setArticle_Cover(cover);
		article.setArticle_Content(content);
		article.setArticle_Tag(tags);
		article.setSort_ID(sortId);
		article.setSort_Name(sortName);
		article.setF_Sort_ID(fSortId);
		article.setRecommend_Num(recommendNum);
		article.setRead_Num(readNum);
		articleService.update(article);
		
		
		// 2.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "推荐文章成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/recommendNote")
	public void recommendNote(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id = Integer.parseInt(request.getParameter("id"));
		String title = "";
		String date = "";
		String cover = "";
		String content = "";
		String tags = "";
		int sortId = 0;
		String sortName = "";
		int fSortId = 0;
		int recommendNum = Integer.parseInt(request.getParameter("recommendNum"));
		int readNum = Integer.parseInt(request.getParameter("readNum"));
		
		// 首先取回需要修改的这篇笔记的数据
		TArticle priNote = articleService.getArticleByID(id);
		title = priNote.getArticle_Title();
		date = priNote.getArticle_Date();
		cover = priNote.getArticle_Cover();
		content = priNote.getArticle_Content();
		tags = priNote.getArticle_Tag();
		sortId = priNote.getSort_ID();
		sortName = priNote.getSort_Name();
		fSortId = priNote.getF_Sort_ID();
		
		
		// 1.修改笔记数据
		TArticle note = new TArticle();
		note.setArticle_ID(id);
		note.setArticle_Title(title);
		note.setArticle_Date(date);
		note.setArticle_Cover(cover);
		note.setArticle_Content(content);
		note.setArticle_Tag(tags);
		note.setSort_ID(sortId);
		note.setSort_Name(sortName);
		note.setF_Sort_ID(fSortId);
		note.setRecommend_Num(recommendNum);
		note.setRead_Num(readNum);
		articleService.update(note);
		
		
		// 2.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "推荐笔记成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	@RequestMapping(value = "/recommendBook")
	public void recommendBook(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id = Integer.parseInt(request.getParameter("id"));
		String name = "";
		int sortId = 0;
		String sortName = "";
		int height = 0;
		String cover = "";
		String link = "";
		int recommendNum = Integer.parseInt(request.getParameter("recommendNum"));
		int downNum = Integer.parseInt(request.getParameter("downNum"));
		
		// 首先取回需要修改的图书的数据
		TBook priBook = bookService.getBookByID(id);
		name = priBook.getBook_Name();
		sortId = priBook.getSort_ID();
		sortName = priBook.getSort_Name();
		height = priBook.getBook_Height();
		cover = priBook.getBook_Cover();
		link = priBook.getBook_Link();
		
		// 1.修改图书数据
		TBook book = new TBook();
		book.setBook_ID(id);
		book.setBook_Name(name);
		book.setSort_ID(sortId);
		book.setSort_Name(sortName);
		book.setBook_Height(height);
		book.setBook_Cover(cover);
		book.setBook_Link(link);
		book.setDownload_Num(downNum);
		book.setRecommend_Num(recommendNum);
		bookService.update(book);
		
		// 2.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "推荐图书成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	
}
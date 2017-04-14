package com.work.controllers.admin;

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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


@Controller
@RequestMapping(value = "/bookAction")
public class AdminBookController {
	
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

	@RequestMapping(value = "/getBookCount")
	public void getBookCount(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int sort = Integer.parseInt(request.getParameter("sort"));
		String name = request.getParameter("name");
		// 做一下新老接口数据参数兼容
	    if (name == null || name == "") {
	    	name = "";
	    }
		int count = bookService.getBookLength(sort, name);
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取图书个数成功");
		jsonObject.put("data", count);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getBookList")
	public void getBookList(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int sort = Integer.parseInt(request.getParameter("sort"));
		String name = request.getParameter("name");
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
	    	seq = "Download_Num";
	    }
	    if (desc == null || desc == "") {
	    	desc = "desc";
	    }
	    
		List <TBook> books = bookService.getBook(sort, name, page, size, seq, desc);
		
		JSONArray bookJsonArray = new JSONArray();
		for(int i=0; i<books.size(); i++){
			JSONObject bookJson = new JSONObject();
			TBook book = books.get(i);
			bookJson.put("Book_ID", book.getBook_ID());
			bookJson.put("Book_Name", book.getBook_Name());
			bookJson.put("Book_Height", book.getBook_Height());
			bookJson.put("Book_Cover", book.getBook_Cover());
			bookJson.put("Sort_Name", book.getSort_Name());
			bookJson.put("Recommend_Num", book.getRecommend_Num());
			bookJson.put("Download_Num", book.getDownload_Num());
			bookJson.put("Book_Link", book.getBook_Link());
			
			bookJsonArray.add(bookJson);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取图书列表成功");
		jsonObject.put("data", bookJsonArray);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/addBook")
	public void addBook(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String name = URLDecoder.decode(URLDecoder.decode(request.getParameter("name"), "utf-8"), "utf-8");
		int sortId = Integer.parseInt(request.getParameter("sortId"));
		String sortName = URLDecoder.decode(URLDecoder.decode(request.getParameter("sortName"), "utf-8"), "utf-8");
		int height = Integer.parseInt(request.getParameter("height"));
		String cover = request.getParameter("cover");
		String link = request.getParameter("link");
		int downNum = 1;
		int recommendNum = 1;
		
		// 1.添加图书数据
		TBook book = new TBook();
		book.setBook_Name(name);
		book.setSort_ID(sortId);
		book.setSort_Name(sortName);
		book.setBook_Height(height);
		book.setBook_Cover(cover);
		book.setBook_Link(link);
		book.setDownload_Num(downNum);
		book.setRecommend_Num(recommendNum);
		bookService.create(book);
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "添加图书成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	@RequestMapping(value = "/delBook")
	public void delBook(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String selectId = request.getParameter("selectId");
		
		for(int i=0; i<selectId.split(";").length; i++){
			TBook book = new TBook();
			book.setBook_ID(Integer.parseInt(selectId.split(";")[i]));
			bookService.delete(book);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "删除图书成功");
		
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
		
		int sortId = book.getSort_ID();
		String sortName = book.getSort_Name();
		String name = book.getBook_Name();
		int height = book.getBook_Height();
		String cover = book.getBook_Cover();
		String link = book.getBook_Link();
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取图书成功");
		jsonObject.put("sortId", sortId);
		jsonObject.put("sortName", sortName);
		jsonObject.put("id", selectId);
		jsonObject.put("name", name);
		jsonObject.put("height", height);
		jsonObject.put("cover", cover);
		jsonObject.put("link", link);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/updateBook")
	public void updateBook(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id = Integer.parseInt(request.getParameter("id"));
		String name = URLDecoder.decode(URLDecoder.decode(request.getParameter("name"), "utf-8"), "utf-8");
		int sortId = Integer.parseInt(request.getParameter("sortId"));
		String sortName = URLDecoder.decode(URLDecoder.decode(request.getParameter("sortName"), "utf-8"), "utf-8");
		int height = Integer.parseInt(request.getParameter("height"));
		String cover = request.getParameter("cover");
		String link = request.getParameter("link");
		int downNum = 1;
		int recommendNum = 1;
		
		// 首先取回需要修改的图书的数据
		TBook priBook = bookService.getBookByID(id);
		downNum = priBook.getRecommend_Num();
		recommendNum = priBook.getDownload_Num();
		if(cover.equals("")){
			cover = priBook.getBook_Cover();
		}
		
		// 1.添加图书数据
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
		jsonObject.put("msg", "修改图书成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
}
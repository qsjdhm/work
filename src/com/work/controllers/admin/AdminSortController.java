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
@RequestMapping(value = "/sortAction")
public class AdminSortController {
	
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
	
	@RequestMapping(value = "/getSortCount")
	public void getSortCount(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int fSort = Integer.parseInt(request.getParameter("fSort"));
		String name = URLDecoder.decode(URLDecoder.decode(request.getParameter("name"), "utf-8"), "utf-8");
		// 做一下新老接口数据参数兼容
	    if (name == null || name == "") {
	    	name = "";
	    }
		int count = sortService.getSortLength(fSort, name);
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取分类个数成功");
		jsonObject.put("data", count);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getSortList")
	public void getSortList(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int fSort = Integer.parseInt(request.getParameter("fSort"));
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
	    	seq = "Sort_ID";
	    }
	    if (desc == null || desc == "") {
	    	desc = "desc";
	    }
		List <TSort> sorts = sortService.getSort(fSort, name, page, size, seq, desc);
		
		JSONArray sortJsonArray = new JSONArray();
		for(int i=0; i<sorts.size(); i++){
			JSONObject sortJson = new JSONObject();
			TSort sort = sorts.get(i);
			sortJson.put("Sort_ID", sort.getSort_ID());
			sortJson.put("Sort_Name", sort.getSort_Name());
			sortJson.put("F_Sort", sort.getF_Sort());
			
			sortJsonArray.add(sortJson);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取分类列表成功");
		jsonObject.put("data", sortJsonArray);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/addSort")
	public void addSort(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int fSortId = Integer.parseInt(request.getParameter("fSortId"));
		String sortName = URLDecoder.decode(URLDecoder.decode(request.getParameter("sortName"), "utf-8"), "utf-8");
		
		// 1.添加分类数据
		TSort sort = new TSort();
		sort.setF_Sort(fSortId);
		sort.setSort_Name(sortName);
		sortService.create(sort);
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "添加分类成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	@RequestMapping(value = "/delSort")
	public void delSort(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String selectId = request.getParameter("selectId");
		
		for(int i=0; i<selectId.split(";").length; i++){
			TSort sort = new TSort();
			sort.setSort_ID(Integer.parseInt(selectId.split(";")[i]));
			sortService.delete(sort);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "删除分类成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getSort")
	public void getSort(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int selectId = Integer.parseInt(request.getParameter("selectId"));
		
		// 1.根据链接id获取分类内容
		TSort sort = sortService.getSortByID(selectId);
		String name = sort.getSort_Name();
		int fSort = sort.getF_Sort();
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取分类成功");
		jsonObject.put("id", selectId);
		jsonObject.put("name", name);
		jsonObject.put("fId", fSort);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/updateSort")
	public void updateSort(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id = Integer.parseInt(request.getParameter("id"));
		int fId = Integer.parseInt(request.getParameter("fId"));
		String name = URLDecoder.decode(URLDecoder.decode(request.getParameter("name"), "utf-8"), "utf-8");
		
		// 首先取回需要修改的分类的数据
		TSort priSort = sortService.getSortByID(id);
		//int fSort = priSort.getF_Sort();
		
		// 1.修改分类数据
		TSort sort = new TSort();
		sort.setSort_ID(id);
		sort.setSort_Name(name);
		sort.setF_Sort(fId);
		sortService.update(sort);
		
		// 2.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "修改分类成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/byTypeGetSort")
	public void byTypeGetSort(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		List <TSort> sorts = null;
		String type = request.getParameter("type");
		if(type.equals("article")){
			sorts = sortService.getSortByAriticleNotNote();
		} else if(type.equals("note")){
			sorts = sortService.getSort(8, "", 1, 10000, "", "");
		} else if(type.equals("tag")){
			sorts = sortService.getSort(4, "", 0, 10000, "", "");
		} else if(type.equals("book")){
			sorts = sortService.getSort(3, "", 1, 10000, "", "");
		}
		
		JSONArray sortJsonArray = new JSONArray();
		for(int i=0; i<sorts.size(); i++){
			JSONObject sortJson = new JSONObject();
			TSort sort = sorts.get(i);
			sortJson.put("Sort_ID", sort.getSort_ID());
			sortJson.put("Sort_Name", sort.getSort_Name());
			sortJsonArray.add(sortJson);
		}
		
		System.out.println(sortJsonArray);
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取分类成功");
		jsonObject.put("data", sortJsonArray);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
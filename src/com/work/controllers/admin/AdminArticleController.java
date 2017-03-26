package com.work.controllers.admin;

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
@RequestMapping(value = "/articleAction")
public class AdminArticleController {
	 
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
	

	/*
	 * 功能：根据文章ID，获取此文章下的评论数据
	 * 参数：id  文章ID
	 * 返回：json数据
	 */
	@RequestMapping(value="/getCommentById", method = {RequestMethod.POST})
	public void getComment(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id= Integer.parseInt(request.getParameter("id"));
		
		
		// 调用服务查询出评论数据
		List <TComment> comments = commentService.getCommentByArticleID(id);
		JSONArray commentJsonArray = new JSONArray();
		if(comments!=null){
			int size = comments.size();
			for(int i=0; i<size; i++){
				JSONObject commentJson = new JSONObject();
				TComment pComment = comments.get(i);
				commentJson.put("id", pComment.getComment_ID());
				commentJson.put("userName", pComment.getComment_Person_Name());
				commentJson.put("time", pComment.getComment_Time());
				commentJson.put("sortID", pComment.getParent_CommentID());
				commentJson.put("content", pComment.getComment_Content());
				
				commentJsonArray.add(commentJson);
			}
		}
		
		response.setCharacterEncoding("UTF-8");
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("commentData", commentJsonArray);
		
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getArticleCount")
	public void getArticleCount(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int sort = Integer.parseInt(request.getParameter("sort"));
		String startTime = request.getParameter("start");
		String endTime = request.getParameter("end");
		int count = articleService.getArticleCount(sort, startTime, endTime);
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取文章个数成功");
		jsonObject.put("data", count);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getArticleList")
	public void getArticleList(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int sort = Integer.parseInt(request.getParameter("sort"));
		String startTime = request.getParameter("start");
		String endTime = request.getParameter("end");
		int page = Integer.parseInt(request.getParameter("page"));
		int size = Integer.parseInt(request.getParameter("size"));
		List <Map<String,Object>> articleList = articleService.getArticleList(sort, startTime, endTime, page, size);
		
		JSONArray articleJsonArray = new JSONArray();
		for(int i=0; i<articleList.size(); i++){
			JSONObject articleJson = new JSONObject();
			Map <String,Object> article = articleList.get(i);
			
			articleJson.put("Article_ID", article.get("Article_ID").toString());
			articleJson.put("Article_Title", article.get("Article_Title").toString());
			articleJson.put("Article_Date", article.get("Article_Date").toString());
			articleJson.put("Article_Tag", article.get("Article_Tag").toString());
			articleJson.put("Sort_ID", article.get("Sort_ID").toString());
			articleJson.put("Sort_Name", article.get("Sort_Name").toString());
			articleJson.put("F_Sort_ID", article.get("F_Sort_ID").toString());
			articleJson.put("Recommend_Num", article.get("Recommend_Num").toString());
			articleJson.put("Read_Num", article.get("Read_Num").toString());
			
			articleJsonArray.add(articleJson);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取文章列表成功");
		jsonObject.put("data", articleJsonArray);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/addArticle")
	public void addArticle(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String title = URLDecoder.decode(URLDecoder.decode(request.getParameter("title"), "utf-8"), "utf-8");
		String date = "";
		String cover = "";
		String content = request.getParameter("content");
		String tags = URLDecoder.decode(URLDecoder.decode(request.getParameter("tags"), "utf-8"), "utf-8");
		int sortId = Integer.parseInt(request.getParameter("sortId"));
		String sortName = URLDecoder.decode(URLDecoder.decode(request.getParameter("sortName"), "utf-8"), "utf-8");
		// 普通文章的父SortId是根据子SortId来的
		int fSortId = Integer.parseInt(request.getParameter("sortId"));
		int recommendNum = 1;
		int readNum = 1;
		
		// 处理时间
		SimpleDateFormat pSMDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		date = pSMDate.format(new Date());
		
		// 处理封面
		HtmlRegexp regexpHtml = new HtmlRegexp();
		List<String> coverImages = regexpHtml.getImg(content);
		if(coverImages.size()!=0){
			// 获取第一个图片作为封面
			cover = coverImages.get(0);
			// 处理服务器和本地的前缀的差异
			cover = new ENV().baseUrl+cover.substring(cover.indexOf("/admin"), cover.length());
			System.out.println(cover);
		}else{
			if(sortId==2){  // 个人作品封面
				cover = new ENV().baseUrl+"/common/images/cover_default.png";
			}else{
				cover = new ENV().baseUrl+"/common/images/cover_default.png";
			}
		}
		
		// 1.添加文章数据
		TArticle article = new TArticle();
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
		articleService.create(article);
		
		// 2.处理不重复的标签并且将新标签添加到表中
		// 处理已存在的分类
		List tagList = new ArrayList();
		List <TSort> sorts = sortService.getSort(4, 1, 10000);
		int size = sorts.size();
		for(int i=0; i<size; i++){
			tagList.add(sorts.get(i).getSort_Name());
		}
		
		// 处理本次新增文章时的分类
		String[] labelList = tags.split(",");
		
		// 对比已经存在的标签  不存在添加到表中
		for(int i=0; i<labelList.length; i++){
	    	if(!tagList.contains(labelList[i])){
	    		TSort sort = new TSort();
	    		sort.setSort_Name(labelList[i]);
	    		sort.setF_Sort(4);
	    		sortService.create(sort);
	    	}
	    }
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "添加文章成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	@RequestMapping(value = "/delArticle")
	public void delArticle(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String selectId = request.getParameter("selectId");
		
		for(int i=0; i<selectId.split(";").length; i++){
			TArticle article = new TArticle();
			article.setArticle_ID(Integer.parseInt(selectId.split(";")[i]));
			articleService.delete(article);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "删除文章成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getArticle")
	public void getArticle(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int selectId = Integer.parseInt(request.getParameter("selectId"));
		
		// 1.根据文章id获取文章内容
		TArticle article = articleService.getArticleByID(selectId);
		String title = article.getArticle_Title();
		String content = article.getArticle_Content();
		int sortId = article.getSort_ID();
		String sortName = article.getSort_Name();
		String tag = article.getArticle_Tag();
		
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取文章成功");
		jsonObject.put("sortId", sortId);
		jsonObject.put("sortName", sortName);
		jsonObject.put("id", selectId);
		jsonObject.put("title", title);
		jsonObject.put("content", content);
		jsonObject.put("tag", tag);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/updateArticle")
	public void updateArticle(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id = Integer.parseInt(request.getParameter("id"));
		String title = URLDecoder.decode(URLDecoder.decode(request.getParameter("title"), "utf-8"), "utf-8");
		String date = "";
		String cover = "";
		String content = request.getParameter("content");
		String tags = URLDecoder.decode(URLDecoder.decode(request.getParameter("tags"), "utf-8"), "utf-8");
		int sortId = Integer.parseInt(request.getParameter("sortId"));
		String sortName = URLDecoder.decode(URLDecoder.decode(request.getParameter("sortName"), "utf-8"), "utf-8");
		// 普通文章的父SortId是根据子SortId来的
		int fSortId = Integer.parseInt(request.getParameter("sortId"));
		int recommendNum = 0;
		int readNum = 0;
		
		// 首先取回需要修改的这篇文章的数据
		TArticle priArticle = articleService.getArticleByID(id);
		date = priArticle.getArticle_Date();
		recommendNum = priArticle.getRecommend_Num();
		readNum = priArticle.getRead_Num();
		
		// 处理封面
		HtmlRegexp regexpHtml = new HtmlRegexp();
		List<String> coverImages = regexpHtml.getImg(content);
		if(coverImages.size()!=0){
			// 获取第一个图片作为封面
			cover = coverImages.get(0);
			// 处理服务器和本地的前缀的差异
			cover = new ENV().baseUrl+cover.substring(cover.indexOf("/admin"), cover.length());
			System.out.println(cover);
		}else{
			if(sortId==2){  // 个人作品封面
				cover = new ENV().baseUrl+"/common/images/cover_default.png";
			}else{
				cover = new ENV().baseUrl+"/common/images/cover_default.png";
			}
		}
		
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
		jsonObject.put("msg", "修改文章成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
}
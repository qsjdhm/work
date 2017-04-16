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
@RequestMapping(value = "/noteAction")
public class AdminNoteController {
	
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
	
	@RequestMapping(value = "/getNoteCount")
	public void getNoteCount(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int sort = Integer.parseInt(request.getParameter("sort"));
		String startTime = request.getParameter("start");
		String endTime = request.getParameter("end");
		int count = articleService.getNoteCount(sort, startTime, endTime);
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取笔记个数成功");
		jsonObject.put("data", count);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getNoteList")
	public void getNoteList(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int sort = Integer.parseInt(request.getParameter("sort"));
		String startTime = request.getParameter("start");
		String endTime = request.getParameter("end");
		String seq = request.getParameter("seq");
		String desc = request.getParameter("desc");
		// 做一下新老接口数据参数兼容
	    if (seq == null || seq == "") {
	    	seq = "Article_Date";
	    }
	    if (desc == null || desc == "") {
	    	desc = "desc";
	    }
		int page = Integer.parseInt(request.getParameter("page"));
		int size = Integer.parseInt(request.getParameter("size"));
		List <Map<String,Object>> noteList = articleService.getNoteList(sort, startTime, endTime, seq, desc, page, size);
		
		JSONArray noteJsonArray = new JSONArray();
		for(int i=0; i<noteList.size(); i++){
			JSONObject noteJson = new JSONObject();
			Map <String,Object> note = noteList.get(i);
			int id = Integer.parseInt(note.get("Article_ID").toString());
			
			// 调用服务查询出评论数据
			List <TComment> comments = commentService.getCommentByArticleID(id);
			JSONArray commentJsonArray = new JSONArray();
			JSONArray UncommentJsonArray = new JSONArray();
			int commentSize = comments.size();
			int unReadSize = 0;
			if(comments!=null){
				
				for(int j=0; j<commentSize; j++){
					JSONObject commentJson = new JSONObject();
					TComment pComment = comments.get(j);
					commentJson.put("id", pComment.getComment_ID());
					commentJson.put("userName", pComment.getComment_Person_Name());
					commentJson.put("time", pComment.getComment_Time());
					commentJson.put("sortID", pComment.getParent_CommentID());
					commentJson.put("content", pComment.getComment_Content());
					commentJson.put("isRead", pComment.getComment_Read());
					
					commentJsonArray.add(commentJson);
					
					// 返回未读评论信息
					if (pComment.getComment_Read() == 0) {
						unReadSize++;
						UncommentJsonArray.add(commentJson);
					}
				}
			}
			
			noteJson.put("Article_ID", note.get("Article_ID").toString());
			noteJson.put("Article_Title", note.get("Article_Title").toString());
			noteJson.put("Article_Date", note.get("Article_Date").toString());
			noteJson.put("Article_Tag", note.get("Article_Tag").toString());
			noteJson.put("Sort_ID", note.get("Sort_ID").toString());
			noteJson.put("Sort_Name", note.get("Sort_Name").toString());
			noteJson.put("F_Sort_ID", note.get("F_Sort_ID").toString());
			noteJson.put("Recommend_Num", note.get("Recommend_Num").toString());
			noteJson.put("Read_Num", note.get("Read_Num").toString());
			noteJson.put("Comment_Num", commentSize);
			noteJson.put("Comment_List", commentJsonArray);
			noteJson.put("Uncomment_Num", unReadSize);
			noteJson.put("Uncomment_List", UncommentJsonArray);
			
			noteJsonArray.add(noteJson);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取笔记列表成功");
		jsonObject.put("data", noteJsonArray);
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/addNote")
	public void addNote(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String title = URLDecoder.decode(URLDecoder.decode(request.getParameter("title"), "utf-8"), "utf-8");
		String date = "";
		String cover = "";
		String content = URLDecoder.decode(URLDecoder.decode(request.getParameter("content"), "utf-8"), "utf-8");
		String tags = URLDecoder.decode(URLDecoder.decode(request.getParameter("tags"), "utf-8"), "utf-8");
		int sortId = Integer.parseInt(request.getParameter("sortId"));
		String sortName = URLDecoder.decode(URLDecoder.decode(request.getParameter("sortName"), "utf-8"), "utf-8");
		int fSortId = 8;
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
			cover = new ENV().baseUrl+"/common/images/cover_default.png";
		}
		
		// 1.添加笔记数据
		TArticle note = new TArticle();
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
		articleService.create(note);
		
		// 2.处理不重复的标签并且将新标签添加到表中
		// 处理已存在的分类
		List tagList = new ArrayList();
		List <TSort> sorts = sortService.getSort(4, "", 1, 10000, "", "");
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
		jsonObject.put("msg", "添加笔记成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	
	@RequestMapping(value = "/delNote")
	public void delArticle(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		String selectId = request.getParameter("selectId");
		
		for(int i=0; i<selectId.split(";").length; i++){
			TArticle note = new TArticle();
			note.setArticle_ID(Integer.parseInt(selectId.split(";")[i]));
			articleService.delete(note);
		}
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "删除笔记成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
	@RequestMapping(value = "/getNote")
	public void getNote(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int selectId = Integer.parseInt(request.getParameter("selectId"));
		
		// 1.根据笔记id获取笔记内容
		TArticle article = articleService.getArticleByID(selectId);
		String title = article.getArticle_Title();
		String content = article.getArticle_Content();
		int sortId = article.getSort_ID();
		String sortName = article.getSort_Name();
		String tag = article.getArticle_Tag();
		
		// 3.返回添加状态信息
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("success", "1");
		jsonObject.put("msg", "获取笔记成功");
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
	
	@RequestMapping(value = "/updateNote")
	public void updateArticle(HttpServletRequest request, HttpServletResponse response) throws Exception{
		
		int id = Integer.parseInt(request.getParameter("id"));
		String title = URLDecoder.decode(URLDecoder.decode(request.getParameter("title"), "utf-8"), "utf-8");
		String date = "";
		String cover = "";
		String content = URLDecoder.decode(URLDecoder.decode(request.getParameter("content"), "utf-8"), "utf-8");
		String tags = URLDecoder.decode(URLDecoder.decode(request.getParameter("tags"), "utf-8"), "utf-8");
		int sortId = Integer.parseInt(request.getParameter("sortId"));
		String sortName = URLDecoder.decode(URLDecoder.decode(request.getParameter("sortName"), "utf-8"), "utf-8");
		// 普通文章的父SortId是根据子SortId来的
		int fSortId = 8;
		int recommendNum = 0;
		int readNum = 0;
		
		// 首先取回需要修改的这篇文章的数据
		TArticle priNote = articleService.getArticleByID(id);
		date = priNote.getArticle_Date();
		recommendNum = priNote.getRecommend_Num();
		readNum = priNote.getRead_Num();
		
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
			cover = new ENV().baseUrl+"/common/images/cover_default.png";
		}
		
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
		jsonObject.put("msg", "修改笔记成功");
		
		response.setContentType("text/html;charset=utf-8");
        response.setHeader("Cache-Control", "no-cache"); 
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(jsonObject); 
	}
	
}
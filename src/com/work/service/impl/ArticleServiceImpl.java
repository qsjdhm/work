package com.work.service.impl;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;

import com.work.dao.IDao;
import com.work.service.IArticleService;
import com.work.service.IService;
import com.work.vo.TArticle;

/**
 * 实现业务逻辑的接口
 */
public class ArticleServiceImpl<T extends TArticle> extends ServiceImpl<T> implements IArticleService<T> {
	
	/**
	 *  根据分类、时间区间获取文章总个数
	 *  @param fSortId 文章总类型id
	 *  @param startTime 开始日期
	 *  @param endTime 结束日期
	 *  @return 文章个数
	 */
	@Override
	public int getArticleCount(int fSortId, String startTime, String endTime) {
		
		if (endTime.equals("")) {
			int year;
	        int month;
	        Calendar calendar = Calendar.getInstance();
	        year = calendar.get(Calendar.YEAR);
	        month = calendar.get(Calendar.MONTH) + 1;
	        endTime = year + "-" + ( month<10 ? "0" + month : month);
		}

		String sql = "";
		if(fSortId==0){
			sql = "select COUNT(*) as count from article where left(Article_Date, 7) >= '"+startTime+"' and left(Article_Date, 7) <= '"+endTime+"' and F_Sort_ID<>8";
		}else{
			sql = "select COUNT(*) as count from article where left(Article_Date, 7) >= '"+startTime+"' and left(Article_Date, 7) <= '"+endTime+"' and F_Sort_ID="+fSortId+"";
		}
		int count = this.getDao().getSqlQueryCount(sql);
		return count;
		
		
//		String sql = "";
//		if(fSortId==0){
//			sql = "select COUNT(*) from TArticle where left(Article_Date, 7) >= '"+startTime+"' and left(Article_Date, 7) <= '"+endTime+"' and F_Sort_ID<>8";
//		}else{
//			sql = "select COUNT(*) from TArticle where left(Article_Date, 7) >= '"+startTime+"' and left(Article_Date, 7) <= '"+endTime+"' and F_Sort_ID="+fSortId+"";
//		}
//		List article = this.getDao().list(sql);
//		Long count = (Long)article.listIterator().next();
//		return count.intValue();
	}
	
	/**
	 *  根据分类、时间区间获取笔记总个数
	 *  @param sortId 笔记子类型
	 *  @param startTime 开始日期
	 *  @param endTime 结束日期
	 *  @return 文章个数
	 */
	@Override
	public int getNoteCount(int sortId, String startTime, String endTime) {
		if (endTime.equals("")) {
			int year;
	        int month;
	        Calendar calendar = Calendar.getInstance();
	        year = calendar.get(Calendar.YEAR);
	        month = calendar.get(Calendar.MONTH) + 1;
	        endTime = year + "-" + ( month<10 ? "0" + month : month);
		}

		String sql = "";
		if(sortId==0){
			sql = "select COUNT(*) as count from article where left(Article_Date, 7) >= '"+startTime+"' and left(Article_Date, 7) <= '"+endTime+"' and F_Sort_ID=8";
		}else{
			sql = "select COUNT(*) as count from article where left(Article_Date, 7) >= '"+startTime+"' and left(Article_Date, 7) <= '"+endTime+"' and Sort_ID="+sortId+"";
		}
		int count = this.getDao().getSqlQueryCount(sql);
		return count;
	}
	
	/**
	 *  根据总分类、开始日期、结束日期、页数、每页个数获取此分类下的文章列表
	 *  @param fSortId 文章总类型id
	 *  @param startTime 开始时间
	 *  @param endTime 结束时间
	 *  @param pageId 当前页
	 *  @param pageNum 每页个数
	 *  @return 文章列表
	 */
	
	@Override
	public List<Map<String, Object>> getArticleList(int fSortId, String startTime, String endTime, int pageId, int pageNum) {
		if (endTime.equals("")) {
			int year;
	        int month;
	        Calendar calendar = Calendar.getInstance();
	        year = calendar.get(Calendar.YEAR);
	        month = calendar.get(Calendar.MONTH) + 1;
	        endTime = year + "-" + ( month<10 ? "0" + month : month);
		}
		// 首先需要根据页数和每页个数计算出起始数和终止数
		int start = pageNum*(pageId-1);
		int end = pageNum;
		String sql = "";
		
		if(fSortId==0){
			sql = "select Article_ID,Article_Title,Article_Date,Article_Tag,Sort_ID,Sort_Name,F_Sort_ID,Recommend_Num,Read_Num from article where left(Article_Date, 7) >= '"+startTime+"' and left(Article_Date, 7) <= '"+endTime+"' and F_Sort_ID<>8 order by Article_ID desc limit "+ start + " , " + end;
		}else{  // 分类查询
			sql = "select Article_ID,Article_Title,Article_Date,Article_Tag,Sort_ID,Sort_Name,F_Sort_ID,Recommend_Num,Read_Num from article where left(Article_Date, 7) >= '"+startTime+"' and left(Article_Date, 7) <= '"+endTime+"' and F_Sort_ID="+fSortId+" order by Article_ID limit "+ start + " , " + end;
		}
		
		List<Map<String,Object>> mapList = this.getDao().sqlQuery(sql);
		if(mapList.size()>0){
			return mapList;
		}
		
		return null;
	}
	
	/**
	 *  根据分类、时间区间获取笔记全部的数据
	 *  @param sortId 笔记子类型
	 *  @param startTime 开始时间
	 *  @param endTime 结束时间
	 *  @param pageId 当前页
	 *  @param pageNum 每页个数
	 *  @return 笔记列表
	 */
	@Override
	public List<Map<String, Object>> getNoteList(int sortId, String startTime, String endTime, int pageId, int pageNum) {
		
		if (endTime.equals("")) {
			int year;
	        int month;
	        Calendar calendar = Calendar.getInstance();
	        year = calendar.get(Calendar.YEAR);
	        month = calendar.get(Calendar.MONTH) + 1;
	        endTime = year + "-" + ( month<10 ? "0" + month : month);
		}
		// 首先需要根据页数和每页个数计算出起始数和终止数
		int start = pageNum*(pageId-1);
		int end = pageNum;
		String sql = "";
		if(sortId==0){
			sql = "select Article_ID,Article_Title,Article_Date,Article_Tag,Sort_ID,Sort_Name,F_Sort_ID,Recommend_Num,Read_Num from article where left(Article_Date, 7) >= '"+startTime+"' and left(Article_Date, 7) <= '"+endTime+"' and F_Sort_ID=8 order by Article_ID desc limit "+ start + " , " + end;
		}else{
			sql = "select Article_ID,Article_Title,Article_Date,Article_Tag,Sort_ID,Sort_Name,F_Sort_ID,Recommend_Num,Read_Num from article where left(Article_Date, 7) >= '"+startTime+"' and left(Article_Date, 7) <= '"+endTime+"' and Sort_ID="+sortId+" order by Article_ID limit "+ start + " , " + end;
		}

		List<Map<String,Object>> mapList = this.getDao().sqlQuery(sql);
		if(mapList.size()>0){
			return mapList;
		}
		
		return null;
	}
	
	/**
	 *  根据类型获取数据分布
	 *  @param type 数据类型
	 *  @return 分布数据值
	 */
	@Override
	public List<Map<String,Object>> getArticleDistribution(String type) {
		
		String sql = "";
		if(type.equals("article")){
			sql = "select cycle,COUNT(*) as count from (select left(Article_Date, 7) cycle  from article where F_Sort_ID<>8) temp group by cycle";
		}else{
			sql = "select cycle,COUNT(*) as count from (select left(Article_Date, 7) cycle from article where F_Sort_ID=8) temp group by cycle";
		}
		List<Map<String,Object>> mapList = this.getDao().sqlQuery(sql);
		if(mapList.size()>0){
			return mapList;
		}
		
		return null;
	}
	
	
	
	/**
	 *  根据总分类、页数、每页个数获取此分类下的文章列表
	 *  @param fSortId 文章总类型id
	 *  @param pageId 当前页
	 *  @param pageNum 每页个数
	 *  @return 文章列表
	 */
	@Override
	public List<T> getArticle(int fSortId, int pageId, int pageNum) {
		
		// 首先需要根据页数和每页个数计算出起始数和终止数
		int start = pageNum*(pageId-1);
		int end = pageNum;
		String sql = "";
		if(fSortId==0){
			sql = "select article from TArticle article order by Article_ID desc ";
		}else{
			sql = "select article from TArticle article where F_Sort_ID="+fSortId+" order by Article_ID desc ";
		}
		List<T> articles = this.getDao().pageQuery(sql, start, end);
		if(articles.size()>0){
			return articles;
		}
		return null;
	}
	
	/**
	 *  根据总分类获得此类型下的文章总个数
	 *  @param fSortId 文章总类型id
	 *  @return 文章个数
	 */
	@Override
	public int getArticleLength(int fSortId) {
		
		String sql = "";
		if(fSortId==0){
			sql = "select COUNT(*) from TArticle";
		}else{
			sql = "select COUNT(*) from TArticle where F_Sort_ID="+fSortId+"";
		}
		List article = this.getDao().list(sql);
		Long count = (Long)article.listIterator().next();
		return count.intValue();
	}
	
	/**
	 *  根据总分类和每页个数获取此分类下文章的总页数
	 *  @param fSortId 文章总类型id
	 *  @param pageNum 每页个数
	 *  @return 总页数
	 */
	@Override
	public int getArticlePageCount(int fSortId, int pageNum) {
		// 先获得总个数
		String sql = "";
		if(fSortId==0){
			sql = "select COUNT(*) from TArticle";
		}else{
			sql = "select COUNT(*) from TArticle where F_Sort_ID="+fSortId+"";
		}
		List article = this.getDao().list(sql);
		int count = ((Long)article.listIterator().next()).intValue();
		
		// 再根据每页个数计算出一共多少页
		int pageCount = (count-1) / pageNum+1;  // 这样就计算好了页码数量，逢1进1
		
		return pageCount;
	}
	
	
	/**
	 *  根据子分类获得此类型下的文章总个数
	 *  @param sortId 文章子类型id
	 *  @return 文章个数
	 */
	@Override
	public int getArticleSubSortLength(int sortId) {
		
		String sql = "select COUNT(*) from TArticle where Sort_ID="+sortId+"";
		List article = this.getDao().list(sql);
		Long count = (Long)article.listIterator().next();
		return count.intValue();
	}
	
	/**
	 *  根据子分类和每页个数获取此分类下文章的总页数
	 *  @param sortId 文章子类型id
	 *  @param pageNum 每页个数
	 *  @return 总页数
	 */
	@Override
	public int getArticleSubSortPageCount(int sortId, int pageNum) {
		
		// 先获得总个数
		String sql = "select COUNT(*) from TArticle where Sort_ID="+sortId+"";
		List article = this.getDao().list(sql);
		int count = ((Long)article.listIterator().next()).intValue();
		
		// 再根据每页个数计算出一共多少页
		int pageCount = (count-1) / pageNum+1;  // 这样就计算好了页码数量，逢1进1
		
		return pageCount;
	}
	
	/**
	 *  根据子分类、页数、每页个数获取此分类下的文章列表
	 *  @param sortId 文章总类型id
	 *  @param pageId 当前页
	 *  @param pageNum 每页个数
	 *  @return 文章列表
	 */
	@Override
	public List<T> getArticleSubSort(int sortId, int pageId, int pageNum) {
		
		int start = pageNum*(pageId-1);
		int end = pageNum;

		String sql = "select article from TArticle article where Sort_ID="+sortId+" order by Article_ID desc ";
		List<T> articles = this.getDao().pageQuery(sql, start, end);
		if(articles.size()>0){
			return articles;
		}
		
		return null;
	}
	
	/**
	 *  根据推荐数获取文章列表
	 *  @param fSortId 文章总类型id
	 *  @param pageId 当前页
	 *  @param pageNum 每页个数
	 *  @return 文章列表
	 */
	@Override
	public List<T> getArticleByRecomNumber(int fSortId, int pageId, int pageNum) {
		
		// 首先需要根据页数和每页个数计算出起始数和终止数
		int start = pageNum*(pageId-1);
		int end = pageNum;
		String sql = "";
		if(fSortId==0){
			sql = "select article from TArticle article order by Read_Num desc ";
		}else{
			sql = "select article from TArticle article where F_Sort_ID="+fSortId+" order by Read_Num desc ";
		}
		List<T> articles = this.getDao().pageQuery(sql, start, end);
		if(articles.size()>0){
			return articles;
		}
		return null;
	}
	
	/**
	 *  根据推荐数获取除了笔记分类的文章的前5个文章
	 *  @param number 个数
	 *  @return 文章列表
	 */
	@Override
	public List<T> getArticleByRecomNotNote(int number) {
		
		String sql = "select article from TArticle article where F_Sort_ID<>8 order by Recommend_Num desc";
		List<T> articles = this.getDao().pageQuery(sql, 0, number);
		if(articles.size()>0){
			return articles;
		}
		return null;
	}

	/**
	 *  根据推荐数获取笔记分类的前5个笔记
	 *  @param number 个数
	 *  @return 文章列表
	 */
	@Override
	public List<T> getArticleByRecomIsNote(int number) {
		
		String sql = "select article from TArticle article where F_Sort_ID=8 order by Recommend_Num desc ";
		List<T> articles = this.getDao().pageQuery(sql, 0, number);
		if(articles.size()>0){
			return articles;
		}
		return null;
	}
	
	/**
	 *  根据关键字获得此关键字下的文章总个数
	 *  @param keyword 关键字
	 *  @param type 类型：1是关键字  2是标签
	 *  @return 文章个数
	 */
	@Override
	public int getArticleLengthByKeyword(String keyword, int type) {
		
		String sql = "";
		if(type==1){
			// 要根据标题、内容、日期、标签查询
			sql = "select COUNT(*) from TArticle where Article_Title like '%"+keyword+"%' or Article_Date like '%"+keyword+"%' or Article_Content like '%"+keyword+"%' or Article_Tag like '%"+keyword+"%'";
		}else if(type==2){
			// 要根据标签是否包含查询
			sql = "select COUNT(*) from TArticle where Article_Tag like '%"+keyword+"%'";
		}
		List article = this.getDao().list(sql);
		Long count = (Long)article.listIterator().next();
		return count.intValue();
	}
	
	/**
	 *  根据关键字获得此关键字下的文章总页数
	 *  @param keyword 关键字
	 *  @param pageNum 每页个数
	 *  @param type 类型：1是关键字  2是标签
	 *  @return 总页数
	 */
	@Override
	public int getArticlePageCountByKeyword(String keyword, int pageNum, int type) {
		
		// 先获得总个数
		String sql = "";
		if(type==1){
			// 要根据标题、内容、日期、标签查询
			sql = "select COUNT(*) from TArticle where Article_Title like '%"+keyword+"%' or Article_Date like '%"+keyword+"%' or Article_Content like '%"+keyword+"%' or Article_Tag like '%"+keyword+"%'";
		}else if(type==2){
			// 要根据标签是否包含查询
			sql = "select COUNT(*) from TArticle where Article_Tag like '%"+keyword+"%'";
		}
		List article = this.getDao().list(sql);
		int count = ((Long)article.listIterator().next()).intValue();
		
		// 再根据每页个数计算出一共多少页
		int pageCount = (count-1) / pageNum+1;  // 这样就计算好了页码数量，逢1进1
		
		return pageCount;
	}
		
		
	/**
	 *  根据关键字、页数、每页个数获取文章列表
	 *  @param keyword 搜索关键字
	 *  @param pageId 当前页
	 *  @param pageNum 每页个数
	 *  @param type 类型：1是关键字  2是标签
	 *  @return 文章列表
	 */
	@Override
	public List<T> getArticleByKeyword(String keyword, int pageId, int pageNum, int type) {
		
		// 首先需要根据页数和每页个数计算出起始数和终止数
		int start = pageNum*(pageId-1);
		int end = pageNum;
		String sql = "";
		if(type==1){
			// 要根据标题、内容、日期、标签查询
			sql = "select article from TArticle article where Article_Title like '%"+keyword+"%' or Article_Date like '%"+keyword+"%' or Article_Content like '%"+keyword+"%' or Article_Tag like '%"+keyword+"%' order by Article_ID desc";
		}else if(type==2){
			// 要根据标签是否包含查询
			sql = "select article from TArticle article where Article_Tag like '%"+keyword+"%' order by Article_ID desc";
		}
		System.out.println(sql);
		List<T> articles = this.getDao().pageQuery(sql, start, end);
		if(articles.size()>0){
			return articles;
		}
		return null;
	}
	
	/**
	 *  根据ID获取文章内容
	 *  @param id 文章ID
	 *  @return 单个文章内容
	 */
	@Override
	public TArticle getArticleByID(int id) {
		
		String sql = "select article from TArticle article where Article_ID="+id+"";
		TArticle article = this.getDao().find((Class<T>) TArticle.class, id);
		
		return article;
	}
	
	/**
	 *  根据ID获取此文章的上一篇文章
	 *  @param id 当前文章ID
	 *  @return 单个文章内容
	 */
	@Override
	public TArticle getPrevArticleByID(int id) {
		
		String sql = "select article from TArticle article where Article_ID<"+id+" ORDER BY Article_ID desc";
		List articles = this.getDao().list(sql);
		TArticle article = new TArticle();
		if(articles!=null){
			int size = articles.size();
			for(int i=0; i<size; i++){
				if(i==0){
					article = (TArticle) articles.get(i);
				}
			}
		}
		
		return article;
	}
	
	/**
	 *  根据ID获取此文章的下一篇文章
	 *  @param id 当前文章ID
	 *  @return 单个文章内容
	 */
	@Override
	public TArticle getNextArticleByID(int id) {
		
		String sql = "select article from TArticle article where Article_ID>"+id+" ORDER BY Article_ID asc";
		List articles = this.getDao().list(sql);
		TArticle article = new TArticle();
		if(articles!=null){
			int size = articles.size();
			for(int i=0; i<size; i++){
				if(i==0){
					article = (TArticle) articles.get(i);
				}
			}
		}
		
		return article;
	}
	
	
	

}

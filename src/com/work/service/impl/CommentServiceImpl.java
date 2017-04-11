package com.work.service.impl;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

import com.work.dao.IDao;
import com.work.service.ICommentService;
import com.work.service.IService;
import com.work.vo.TComment;

/**
 * 实现业务逻辑的接口
 */
public class CommentServiceImpl<T extends TComment> extends ServiceImpl<T> implements ICommentService<T> {
	
	/**
	 *  获取数据分布
	 *  @param startTime 开始日期
	 *  @param endTime 结束日期
	 *  @return 分布数据值
	 */
	@Override
	public List<Map<String,Object>> getCommentDistribution(String startTime, String endTime) {
		
		if (endTime.equals("")) {
			int year;
	        int month;
	        Calendar calendar = Calendar.getInstance();
	        year = calendar.get(Calendar.YEAR);
	        month = calendar.get(Calendar.MONTH) + 1;
	        endTime = year + "-" + ( month<10 ? "0" + month : month);
		}
		
		String sql = "select cycle,COUNT(*) as count from (select left(Comment_Time, 7) cycle from comment where left(Comment_Time, 7) >= '"+startTime+"' and left(Comment_Time, 7) <= '"+endTime+"') temp group by cycle";
		List<Map<String,Object>> mapList = this.getDao().sqlQuery(sql);
		if(mapList.size()>0){
			return mapList;
		}
		
		return null;
	}
	
	/**
	 *  根据类型、时间区间获取评论总个数
	 *  @param type 类型（已读、未读、全部）
	 *  @param startTime 开始日期
	 *  @param endTime 结束日期
	 *  @return 评论总个数
	 */
	@Override
	public int getCommentLength(String type, String startTime, String endTime) {
		if (endTime.equals("")) {
			int year;
	        int month;
	        Calendar calendar = Calendar.getInstance();
	        year = calendar.get(Calendar.YEAR);
	        month = calendar.get(Calendar.MONTH) + 1;
	        endTime = year + "-" + ( month<10 ? "0" + month : month);
		}
		String sql = "";
		if (type.equals("2")) {
			sql = "select COUNT(*) as count from comment where left(Comment_Time, 7) >= '"+startTime+"' and left(Comment_Time, 7) <= '"+endTime+"'";
		} else {
			sql = "select COUNT(*) as count from comment where left(Comment_Time, 7) >= '"+startTime+"' and left(Comment_Time, 7) <= '"+endTime+"' and Comment_Read="+type+"";
		}

		int count = this.getDao().getSqlQueryCount(sql);
		return count;
	}
	
	/**
	 *  根据类型、开始日期、结束日期、页数、每页个数获取评论列表
	 *  @param type 类型（已读、未读、全部）
	 *  @param startTime 开始时间
	 *  @param endTime 结束时间
	 *  @param pageId 当前页
	 *  @param pageNum 每页个数
	 *  @return 评论总个数
	 */
	@Override
	public List<Map<String, Object>> getCommentList(String type, String startTime, String endTime, String seq, String desc, int pageId, int pageNum) {
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
		if (type.equals("2")) {
			sql = "select * from comment where left(Comment_Time, 7) >= '"+startTime+"' and left(Comment_Time, 7) <= '"+endTime+"' order by "+seq+" "+desc+" limit "+ start + " , " + end;
		} else {
			sql = "select * from comment where left(Comment_Time, 7) >= '"+startTime+"' and left(Comment_Time, 7) <= '"+endTime+"' and Comment_Read="+type+" order by "+seq+" "+desc+" limit "+ start + " , " + end;
		}
		
		List<Map<String,Object>> mapList = this.getDao().sqlQuery(sql);
		if(mapList.size()>0){
			return mapList;
		}
		
		return null;
	}
	
	/**
	 *  获取未读评论的总个数
	 *  @return 未读总个数
	 */
	@Override
	public int getUnreadCommentLength() {
		String sql = "select COUNT(*) from TComment where Comment_Read=0";
		List comment = this.getDao().list(sql);
		Long count = (Long)comment.listIterator().next();
		return count.intValue();
	}
	
	/**
	 *  根据每页个数获取评论的总页数
	 *  @param pageNum 每页个数
	 *  @return 总页数
	 */
	@Override
	public int getCommentPageCount(int pageNum) {
		
		// 先获得总个数
		String sql = "select COUNT(*) from TComment";
		List comment = this.getDao().list(sql);
		int count = ((Long)comment.listIterator().next()).intValue();
		
		// 再根据每页个数计算出一共多少页
		int pageCount = (count-1) / pageNum+1;  // 这样就计算好了页码数量，逢1进1
		
		return pageCount;
	}

	/**
	 *  根据当前页数、每页个数获取评论列表
	 *  @param pageId 当前页数
	 *  @param pageNum 每页个数
	 *  @return 评论列表
	 */
	@Override
	public List<T> getComment(int pageId, int pageNum) {
		
		// 首先需要根据页数和每页个数计算出起始数和终止数
		int start = pageNum*(pageId-1);
		int end = pageNum;
		String sql = "select comment from TComment comment order by Comment_ID desc ";
		List<T> links = this.getDao().pageQuery(sql, start, end);
		if(links.size()>0){
			return links;
		}
		return null;
	}
	
	/**
	 *  根据时间获取最新的前number条评论
	 *  @param number 获取评论个数
	 *  @return 评论列表
	 */
	@Override
	public List<T> getCommentByTime(int number) {
		
		// 首先需要根据页数和每页个数计算出起始数和终止数
		String sql = "select comment from TComment comment order by Comment_ID desc ";
		List<T> comments = this.getDao().pageQuery(sql, 0, number);
		if(comments.size()>0){
			return comments;
		}
		return null;
	}

	/**
	 *  根据文章ID获取此文章下的评论
	 *  @param id 文章ID
	 *  @return 评论列表
	 */
	@Override
	public List<T> getCommentByArticleID(int id) {
		
		// 首先需要根据页数和每页个数计算出起始数和终止数
		String sql = "select comment from TComment comment where Comment_ArticleID="+id+" order by Comment_Time desc ";
		List<T> comments = this.getDao().pageQuery(sql, 0, 1000);
		//if(comments.size()>0){
			return comments;
		//}
		//return null;
	}
	
	/**
	 *  根据ID获取评论内容
	 *  @param id 评论ID
	 *  @return 单个评论内容
	 */
	@Override
	public TComment getCommentByID(int id) {
		
		String sql = "select comment from TComment comment where Comment_ID="+id+"";
		TComment comment = this.getDao().find((Class<T>) TComment.class, id);
		
		return comment;
	}
	
	/**
	 *  更新评论的未读字段（设为已读）
	 *  @param id 评论ID
	 *  @return 单个评论内容
	 */
	@Override
	public TComment updateCommentUnread(int id) {
		TComment priComment = getCommentByID(id);
		
		TComment comment = new TComment();
		comment.setComment_ID(priComment.getComment_ID());
		comment.setComment_Person_Name(priComment.getComment_Person_Name());
		comment.setComment_Person_Email(priComment.getComment_Person_Email());
		comment.setComment_Content(priComment.getComment_Content());
		comment.setComment_Time(priComment.getComment_Time());
		comment.setComment_ArticleID(priComment.getComment_ArticleID());
		comment.setComment_ArticleTitle(priComment.getComment_ArticleTitle());
		comment.setComment_Read(1);
		comment.setParent_CommentID(priComment.getParent_CommentID());
		this.getDao().update((T) comment);
		
		return comment;
	}
	
	
}

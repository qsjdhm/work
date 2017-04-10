package com.work.service;

import java.util.List;
import java.util.Map;

import com.work.vo.TComment;


public interface ICommentService <T extends TComment> extends IService<T> {
	
	// 获取评论的数据分布
	public List<Map<String, Object>> getCommentDistribution(String startTime, String endTime);
	
	// 根据类型、时间区间获取评论总个数
	public int getCommentLength(String type, String startTime, String endTime);
	
	// 根据类型、开始日期、结束日期、页数、每页个数获取评论列表
	public List<Map<String, Object>> getCommentList(String type, String startTime, String endTime, String seq, String desc, int pageId, int pageNum);
	
	
	// 根据每页个数获取评论的总页数
	public int getCommentPageCount(int pageNum);
	
	// 获取未读评论的总个数
	public int getUnreadCommentLength();
	

	// 根据当前页数、每页个数获取评论列表
	public List<T> getComment(int pageId, int pageNum);
	
	// 根据时间获取最新的前5条评论
	public List<T> getCommentByTime(int number);
	
	// 根据文章ID获取此文章下的评论
	public List<T> getCommentByArticleID(int id);
	
	// 根据ID获取评论内容
	public TComment getCommentByID(int id);
	
	// 更新评论的未读字段（设为已读）
	public TComment updateCommentUnread(int id);
}


package com.work.service;

import java.util.List;
import java.util.Map;

import com.work.vo.TBook;


public interface IBookService <T extends TBook> extends IService<T> {
	
	// 获取评论的数据分布
	public List<Map<String, Object>> getBookDistribution(int SortId);
	
	// 根据总分类、名称获得此类型下的图书总个数
	public int getBookLength(int SortId, String name);
	
	// 根据总分类和每页个数获取此分类下图书的总页数
	public int getBookPageCount(int SortId, int pageNum);
	
	// 根据分类、名称、页数、每页个数获取此分类下的图书列表
	public List<T> getBook(int SortId, String name, int pageId, int pageNum, String seq, String desc);

	// 根据推荐数获取图书的前3个
	public List<T> getBookByRecom(int number);
	
	// 根据id获取图书内容
	public TBook getBookByID(int id);
	
}


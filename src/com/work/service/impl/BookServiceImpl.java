package com.work.service.impl;

import java.util.List;
import java.util.Map;

import org.hibernate.Query;

import com.work.dao.IDao;
import com.work.service.IBookService;
import com.work.service.IService;
import com.work.vo.TBook;

/**
 * 实现业务逻辑的接口
 */
public class BookServiceImpl<T extends TBook> extends ServiceImpl<T> implements IBookService<T> {
	
	/**
	 *  获取数据分布
	 *  @param sortId 图书类型id
	 *  @return 分布数据值
	 */
	@Override
	public List<Map<String,Object>> getBookDistribution(int SortId) {
		
		String sql = "";
		if (SortId == 0) {
			sql = "select cycle,COUNT(*) as count from (select Sort_Name cycle from book) temp group by cycle";
		} else {
			sql = "select cycle,COUNT(*) as count from (select Sort_Name cycle from book where Sort_ID="+SortId+") temp group by cycle";
		}
		
		List<Map<String,Object>> mapList = this.getDao().sqlQuery(sql);
		if(mapList.size()>0){
			return mapList;
		}
		
		return null;
	}
	
	/**
	 *  根据总分类、名称获得此类型下的图书总个数
	 *  @param sortId 图书类型id
	 *  @param name   图书名称（用作模糊查询）
	 *  @return 图书个数
	 */
	@Override
	public int getBookLength(int sortId, String name) {
		String sql = "";
		if(sortId==0){
			sql = "select COUNT(*) as count from book where Book_Name like '%"+name+"%'";
		}else{
			sql = "select COUNT(*) as count from book where Sort_ID="+sortId+" and Book_Name like '%"+name+"%'";
		}
		int count = this.getDao().getSqlQueryCount(sql);
		return count;
	}
	
	/**
	 *  根据分类和每页个数获取此分类下图书的总页数
	 *  @param sortId 图书类型id
	 *  @param pageNum 每页个数
	 *  @return 总页数
	 */
	@Override
	public int getBookPageCount(int sortId, int pageNum) {
		// 先获得总个数
		String sql = "";
		if(sortId==0){
			sql = "select COUNT(*) from TBook";
		}else{
			sql = "select COUNT(*) from TBook where Sort_ID="+sortId+"";
		}
		List book = this.getDao().list(sql);
		int count = ((Long)book.listIterator().next()).intValue();
		
		// 再根据每页个数计算出一共多少页
		int pageCount = (count-1) / pageNum+1;  // 这样就计算好了页码数量，逢1进1
		
		return pageCount;
	}
	
	/**
	 *  根据分类、名称、页数、每页个数获取此分类下的图书列表
	 *  @param sortId 图书类型id
	 *  @param name   图书名称（用作模糊查询）
	 *  @param pageId 当前页
	 *  @param pageNum 每页个数
	 *  @param seq 排序字段
	 *  @param desc 排序顺序
	 *  @return 图书列表
	 */
	@Override
	public List<T> getBook(int sortId, String name, int pageId, int pageNum, String seq, String desc) {
		
		// 首先需要根据页数和每页个数计算出起始数和终止数
		int start = pageNum*(pageId-1);
		int end = pageNum;
		String sql = "";
		if(sortId==0){
			sql = "select book from TBook book where Book_Name like '%"+name+"%' order by "+seq+" "+desc;
		}else{
			sql = "select book from TBook book where Book_Name like '%"+name+"%' and Sort_ID="+sortId+" order by "+seq+" "+desc;
		}
		List<T> books = this.getDao().pageQuery(sql, start, end);
		if(books.size()>0){
			return books;
		}
		return null;
	}
	
	/**
	 *  根据推荐数获取图书的前3个
	 *  @param number 个数
	 *  @return 图书列表
	 */
	@Override
	public List<T> getBookByRecom(int number) {
		
		String sql = "select book from TBook book order by Recommend_Num desc ";
		List<T> books = this.getDao().pageQuery(sql, 0, number);
		if(books.size()>0){
			return books;
		}
		return null;
	}
	
	/**
	 *  根据ID获取图书内容
	 *  @param id 图书ID
	 *  @return 单个图书内容
	 */
	@Override
	public TBook getBookByID(int id) {
		
		String sql = "select book from TBook book where Book_ID="+id+"";
		TBook book = this.getDao().find((Class<T>) TBook.class, id);
		
		return book;
	}

}

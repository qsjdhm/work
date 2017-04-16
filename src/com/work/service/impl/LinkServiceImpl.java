package com.work.service.impl;

import java.util.List;

import com.work.dao.IDao;
import com.work.service.ILinkService;
import com.work.service.IService;
import com.work.vo.TLink;

/**
 * 实现业务逻辑的接口
 */
public class LinkServiceImpl<T extends TLink> extends ServiceImpl<T> implements ILinkService<T> {

	/**
	 *  获取对外链接的总个数
	 *  @return 总个数
	 */
	@Override
	public int getLinkLength(String name) {
		
		String sql = "select COUNT(*) from TLink where Link_Name like '%"+name+"%'";
		List comment = this.getDao().list(sql);
		Long count = (Long)comment.listIterator().next();
		return count.intValue();
	}

	/**
	 *  根据每页个数获取对外链接的总页数
	 *  @param pageNum 每页个数
	 *  @return 总页数
	 */
	@Override
	public int getLinkPageCount(int pageNum) {
		
		// 先获得总个数
		String sql = "select COUNT(*) from TLink";
		List comment = this.getDao().list(sql);
		int count = ((Long)comment.listIterator().next()).intValue();
		
		// 再根据每页个数计算出一共多少页
		int pageCount = (count-1) / pageNum+1;  // 这样就计算好了页码数量，逢1进1
		
		return pageCount;
	}

	/**
	 *  根据当前页数、每页个数获取对外链接列表
	 *  @param pageId 当前页数
	 *  @param pageNum 每页个数
	 *  @return 外链接列表
	 */
	@Override
	public List<T> getLink(int pageId, int pageNum, String name, String seq, String desc) {
		
		// 首先需要根据页数和每页个数计算出起始数和终止数
		int start = pageNum*(pageId-1);
		int end = pageNum;
		if (seq.equals("")) {
			seq = "Link_ID";
		}
		if (desc.equals("")) {
			desc = "desc";
		}
		String sql = "select link from TLink link where Link_Name like '%"+name+"%' order by "+seq+" "+desc;
		List<T> links = this.getDao().pageQuery(sql, start, end);
		return links;
	}
	
	/**
	 *  根据ID获取链接内容
	 *  @param id 链接ID
	 *  @return 单个链接内容
	 */
	@Override
	public TLink getLinkByID(int id) {
		
		String sql = "select link from TLink link where Link_ID="+id+"";
		TLink link = this.getDao().find((Class<T>) TLink.class, id);
		
		return link;
	}

}

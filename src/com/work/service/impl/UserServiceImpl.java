package com.work.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.work.dao.IDao;
import com.work.service.IUserService;
import com.work.service.IService;
import com.work.util.OperateString;
import com.work.vo.TUser;

/**
 * 实现业务逻辑的接口
 */
public class UserServiceImpl<T extends TUser> extends ServiceImpl<T> implements IUserService<T> {

	/**
	 *  获取用户的总个数
	 *  @return 总个数
	 */
	@Override
	public int getUserLength(String name) {
		
		String sql = "select COUNT(*) from TUser where User_Account like '%"+name+"%'";
		List comment = this.getDao().list(sql);
		Long count = (Long)comment.listIterator().next();
		return count.intValue();
	}

	/**
	 *  根据每页个数获取用户的总页数
	 *  @param pageNum 每页个数
	 *  @return 总页数
	 */
	@Override
	public int getUserPageCount(int pageNum) {
		
		// 先获得总个数
		String sql = "select COUNT(*) from TUser";
		List comment = this.getDao().list(sql);
		int count = ((Long)comment.listIterator().next()).intValue();
		
		// 再根据每页个数计算出一共多少页
		int pageCount = (count-1) / pageNum+1;  // 这样就计算好了页码数量，逢1进1
		
		return pageCount;
	}

	/**
	 *  根据当前页数、每页个数获取用户列表
	 *  @param pageId 当前页数
	 *  @param pageNum 每页个数
	 *  @return 用户列表
	 */
	@Override
	public List<T> getUser(int pageId, int pageNum, String name, String seq, String desc) {
		
		// 首先需要根据页数和每页个数计算出起始数和终止数
		int start = pageNum*(pageId-1);
		int end = pageNum;
		String sql = "select user from TUser user where User_Account like '%"+name+"%' order by "+seq+" "+desc;
		List<T> users = this.getDao().pageQuery(sql, start, end);
		if(users.size()>0){
			return users;
		}
		return null;
	}
	
	/**
	 *  根据ID获取用户内容
	 *  @param id 用户ID
	 *  @return 单个用户内容
	 */
	@Override
	public TUser getUserByID(int id) {
		
		String sql = "select user from TUser user where User_ID="+id+"";
		TUser user = this.getDao().find((Class<T>) TUser.class, id);
		
		return user;
	}
	
	/**
	 *  更新用户的session字段
	 *  @param id 用户ID
	 *  @return 单个用户内容
	 */
	@Override
	public TUser updateUserToken(int id) {
		
		TUser proUser = getUserByID(id);
		OperateString operateString = new OperateString();
		// 生成新的md5，并存到数据库中
		String token = "";
		try {
			token = operateString.encoderByMd5(proUser.getUser_Account() + new SimpleDateFormat("yyyyMMddHHmmssSSS") .format(new Date()));
		} catch (Exception e) {
			// TODO 自动生成的 catch 块
			e.printStackTrace();
		}
		
		TUser user = new TUser();
		user.setUser_ID(proUser.getUser_ID());
		user.setUser_Account(proUser.getUser_Account());
		user.setUser_Password(proUser.getUser_Password());
		user.setUser_Email(proUser.getUser_Email());
		user.setSessionId(proUser.getSessionId());
		user.setUser_Token(token);
		this.getDao().update((T) user);
		
		return user;
	}
	

}

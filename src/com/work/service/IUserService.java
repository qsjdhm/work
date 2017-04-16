package com.work.service;

import java.util.List;

import com.work.vo.TUser;


public interface IUserService <T extends TUser> extends IService<T> {

	// 获取用户的总个数
	public int getUserLength(String name);
	
	// 根据每页个数获取用户的总页数
	public int getUserPageCount(int pageNum);

	// 根据当前页数、每页个数获取用户列表
	public List<T> getUser(int pageId, int pageNum, String name, String seq, String desc);
	
	// 根据ID获取用户内容
	public TUser getUserByID(int id);
	
	// 更新用户最新token
	public TUser updateUserToken(int id);
	
}


package com.work.dao;

import java.util.List;
import java.util.Map;

/**
 * 声明数据访问的接口
 */
public interface IDao<T> {
    /**
     * 功能描述：根据id查找对象
     */
	public T find(Class<T> clazz ,int id);
    /**
     * 功能描述：创建实例对象
     */
	public void create(T bean);
	/**
	 * 功能描述：保存对象
	 */
	public void update(T bean);
	/**
	 * 功能描述：删除对象
	 */
	public void delete(T bean);
	/**
	 * 功能描述：列出对象
	 */
	public List<T> list(String hql);
	/**
	 * 功能描述：查询从第几条到第几条记录
	 */
	public List<T> pageQuery(String hql, int start, int end);
	/**
	 * 功能描述：执行mysql原生sql查询语句
	 */
	public List<Map<String, Object>> sqlQuery(String sql);
	/**
	 * 功能描述：执行mysql原生sql查询语句--带分页
	 */
	public List<Map<String, Object>> pageSqlQuery(String sql, int start, int end);
	/**
	 * 功能描述：执行mysql原生sql查询获取总数
	 */
	public int getSqlQueryCount(String sql);
}

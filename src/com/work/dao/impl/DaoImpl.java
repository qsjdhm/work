package com.work.dao.impl;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.hibernate.transform.Transformers;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.work.dao.IDao;


/**
 * 实现数据访问的接口
 */
public class DaoImpl<T> extends HibernateDaoSupport implements IDao<T> {

	/**
     * 功能描述：创建实例对象
     * @param bean 对象
     */
	@Override
	public void create(T bean) {
		this.getHibernateTemplate().persist(bean);
	}
	/**
	 * 功能描述：删除对象
	 * @param bean 对象
	 */
	@Override
	public void delete(T bean) {
		this.getHibernateTemplate().delete(bean);
	}

	 /**
     * 功能描述：根据id查找对象
     * @param id 对象id
     */
	@SuppressWarnings("unchecked")
	@Override
	public T find(Class<T> clazz, int id) {
		return (T) this.getHibernateTemplate().get(clazz, id);
	}
	/**
	 * 功能描述：列出对象
	 * @param hql 查询的hql语句
	 * @return 对象集合
	 */
    @SuppressWarnings("unchecked")
	@Override
	public List<T> list(String hql) {
		return this.getHibernateTemplate().find(hql);
	}
	/**
	 * 功能描述：保存对象
	 * @param bean 对象
	 */
	@Override
	public void update(T bean) {
		this.getHibernateTemplate().update(bean);
	}
	/**
	 * 功能描述：查询从第几条到第几条记录
	 * @param hql 查询的hql语句
	 * @param start 从第几条开始
	 * @param end 到第几条结束
	 * @return 对象集合
	 */
	@Override
	public List<T> pageQuery(String hql, int start, int end) {
		Query query = this.getHibernateTemplate().getSessionFactory().openSession().createQuery(hql);
	    return query.setFirstResult(start).setMaxResults(end).list();
	}
	/**
	 * 功能描述：执行mysql原生sql查询语句
	 * @param sql 查询的sql语句
	 * @return map对象集合
	 */
	@Override
	public List<Map<String,Object>> sqlQuery(String sql) {
		// 调用原生sql不支持text类型字段查询
		Query query = this.getHibernateTemplate().getSessionFactory().openSession().createSQLQuery(sql);
		// 获得的对象转为普通list
		query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
		return query.list();
	}
	/**
	 * 功能描述：执行mysql原生sql查询语句--带分页
	 * @param sql 查询的sql语句
	 * @param start 从第几条开始
	 * @param end 到第几条结束
	 * @return map对象集合
	 */
	@Override
	public List<Map<String,Object>> pageSqlQuery(String sql, int start, int end) {
		Query query = this.getHibernateTemplate().getSessionFactory().openSession().createSQLQuery(sql);
		// 获得的对象转为普通list
		query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
		return query.setFirstResult(start).setMaxResults(end).list();
	}
	/**
	 * 功能描述：执行mysql原生sql查询获取总数
	 * @param sql 查询的sql语句
	 * @return 查询结果总数
	 */
	@Override
	public int getSqlQueryCount(String sql) {
		// TODO 自动生成的方法存根
		Query query = this.getHibernateTemplate().getSessionFactory().openSession().createSQLQuery(sql);
		// 获得的对象转为普通list
		query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
		
		Map<String, Object> countMap = (Map<String, Object>) query.list().get(0);
		BigInteger count = (BigInteger) countMap.get("count");
		return count.intValue();
	}

}

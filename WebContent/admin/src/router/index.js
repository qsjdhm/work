import Vue from 'vue'
import Router from 'vue-router'
//import LoginPage from '@/views/LoginPage'
//import About from '@/components/About'
//import About2 from '@/components/About2'

import auth from '../utils/auth'

Vue.use(Router)

function directFremework (to, from, next) {
    if (auth.loggedIn()) {
        next({
            path: '/home/analyze-dashboard'
        })
    } else {
        next()
    }
}


function requireAuth (to, from, next) {
	if (!auth.loggedIn()) {
		next({
			path: '/',
			query: { redirect: to.fullPath }
		})
	} else {
		next()
	}
}

// 架构菜单
const login                     = resolve => require(['../views/login'], resolve);
const framework                 = resolve => require(['../views/framework'], resolve);
// 分析菜单
const analyzeDashboard          = resolve => require(['../views/analyze/dashboard'], resolve);
const analyzeArticleTerritory   = resolve => require(['../views/analyze/article/article-territory'], resolve);
const analyzeArticleData        = resolve => require(['../views/analyze/article/article-data'], resolve);
const analyzeCommentTerritory   = resolve => require(['../views/analyze/comment/comment-territory'], resolve);
// 数据管理菜单
const dataArticleAdd            = resolve => require(['../views/data/article/article-add'], resolve);
const dataArticleDel            = resolve => require(['../views/data/article/article-del'], resolve);
const dataNoteAdd               = resolve => require(['../views/data/note/note-add'], resolve);


export default new Router({
    routes: [
        {
          path: '/',
          name: '登录',
          component: login,
          beforeEnter: directFremework,
        },
        {
            path: '/home',
            name: '框架',
            component: framework,
            beforeEnter: requireAuth,
            children: [
                {
                    meta: { pId: '1' },
                    path: 'analyze-dashboard',
					name: '数据概览',
                    component: analyzeDashboard
                },
                {
                    meta: { pId: '1' },
                    path: 'analyze-article-territory',
                    name: '地域分析',
                    component: analyzeArticleTerritory
                },
                {
                    meta: { pId: '1' },
                    path: 'analyze-article-data',
                    name: '数据分析',
                    component: analyzeArticleData
                },
                {
                    meta: { pId: '1' },
                    path: 'analyze-comment-territory',
                    name: '地域分析',
                    component: analyzeCommentTerritory
                },


                {
                    meta: { pId: '2' },
                    path: 'data-article-add',
                    name: '新增文章',
                    component: dataArticleAdd
                },
                {
                    meta: { pId: '2' },
                    path: 'data-article-del',
                    name: '删除文章22',
                    component: dataArticleDel
                },
                {
                    meta: { pId: '2' },
                    path: 'data-note-add',
                    name: '新增笔记',
                    component: dataNoteAdd
                }
            ]
        },
        //{
        //    path: '/error',
        //    name: 'Note',
        //    component: About2,
        //    beforeEnter: requireAuth
        //}
    ]
})



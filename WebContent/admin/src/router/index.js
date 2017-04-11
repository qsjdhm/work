import Vue from 'vue'
import Router from 'vue-router'
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
const analyzeArticlePV          = resolve => require(['../views/analyze/article/article-pv'], resolve);
const analyzeArticleData        = resolve => require(['../views/analyze/article/article-data'], resolve);
const analyzeNotePV             = resolve => require(['../views/analyze/note/note-pv'], resolve);
const analyzeNoteData           = resolve => require(['../views/analyze/note/note-data'], resolve);
const analyzeCommentHeat        = resolve => require(['../views/analyze/comment/comment-heat'], resolve);
const analyzeBookHeat           = resolve => require(['../views/analyze/book/book-heat'], resolve);
// 数据管理菜单
const dataDashboard             = resolve => require(['../views/data/dashboard'], resolve);
const dataArticleAdd            = resolve => require(['../views/data/article/article-add'], resolve);
const dataArticleEdit           = resolve => require(['../views/data/article/article-edit'], resolve);
const dataArticleDetails        = resolve => require(['../views/data/article/article-details'], resolve);
const dataArticleDel            = resolve => require(['../views/data/article/article-del'], resolve);

const dataNoteAdd               = resolve => require(['../views/data/note/note-add'], resolve);
const dataNoteEdit              = resolve => require(['../views/data/note/note-edit'], resolve);
const dataNoteDetails           = resolve => require(['../views/data/note/note-details'], resolve);
const dataNoteDel               = resolve => require(['../views/data/note/note-del'], resolve);

const dataCommentEdit           = resolve => require(['../views/data/comment/comment-edit'], resolve);
const dataCommentArticle        = resolve => require(['../views/data/comment/comment-article'], resolve);




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
                    meta: { pId: '1' },  // 用来给每个子页面做当前顶级菜单对比，看看是否需要跳转顶级菜单
                    path: 'analyze-dashboard',
					name: '数据概览',
                    component: analyzeDashboard
                },
                {
                    meta: { pId: '1' },
                    path: 'analyze-article-pv',
                    name: '用户访问量',
                    component: analyzeArticlePV
                },
                {
                    meta: { pId: '1' },
                    path: 'analyze-article-data',
                    name: '数据分布',
                    component: analyzeArticleData
                },
				{
					meta: { pId: '1' },
					path: 'analyze-note-pv',
					name: '用户访问量',
					component: analyzeNotePV
				},
				{
					meta: { pId: '1' },
					path: 'analyze-note-data',
					name: '数据分布',
					component: analyzeNoteData
				},
                {
                    meta: { pId: '1' },
                    path: 'analyze-comment-heat',
                    name: '评论热度值',
                    component: analyzeCommentHeat
                },
				{
					meta: { pId: '1' },
					path: 'analyze-book-heat',
					name: '图书热度值',
					component: analyzeBookHeat
				},

                {
                    meta: { pId: '2' },  // 用来给每个子页面做当前顶级菜单对比，看看是否需要跳转顶级菜单
                    path: 'data-dashboard',
                    name: '功能地图',
                    component: dataDashboard
                },
                {
                    meta: { pId: '2' },
                    path: 'data-article-add',
                    name: '新增文章',
                    component: dataArticleAdd
                },
                {
                    meta: { pId: '2' },
                    path: 'data-article-edit',
                    name: '编辑文章',
                    component: dataArticleEdit,
                },
				{
					meta: { pId: '2' },
					path: 'data-article-edit/:detailsId',
					name: '文章详情',
					component: dataArticleDetails
				},
                {
                    meta: { pId: '2' },
                    path: 'data-article-del',
                    name: '删除文章',
                    component: dataArticleDel
                },
                {
                    meta: { pId: '2' },
                    path: 'data-note-add',
                    name: '新增笔记',
                    component: dataNoteAdd
                },
                {
                    meta: { pId: '2' },
                    path: 'data-note-edit',
                    name: '编辑笔记',
                    component: dataNoteEdit
                },
                {
                    meta: { pId: '2' },
                    path: 'data-note-edit/:detailsId',
                    name: '笔记详情',
                    component: dataNoteDetails
                },
                {
                    meta: { pId: '2' },
                    path: 'data-note-del',
                    name: '删除笔记',
                    component: dataNoteDel
                },
                {
                    meta: { pId: '2' },
                    path: 'data-comment-edit/:type',
                    name: '编辑评论',
                    component: dataCommentEdit
                },
                {
                    meta: { pId: '2' },
                    path: 'data-comment-edit/list/:articleId',
                    name: '文章评论列表',
                    component: dataCommentArticle
                },
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



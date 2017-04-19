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
const dataCommentDetails        = resolve => require(['../views/data/comment/comment-details'], resolve);
const dataCommentDel            = resolve => require(['../views/data/comment/comment-del'], resolve);

const dataBookAdd               = resolve => require(['../views/data/book/book-add'], resolve);
const dataBookEdit              = resolve => require(['../views/data/book/book-edit'], resolve);
const dataBookDetails           = resolve => require(['../views/data/book/book-details'], resolve);
const dataBookDel               = resolve => require(['../views/data/book/book-del'], resolve);

const dataClassifyAdd           = resolve => require(['../views/data/classify/classify-add'], resolve);
const dataClassifyEdit          = resolve => require(['../views/data/classify/classify-edit'], resolve);
const dataClassifyDetails       = resolve => require(['../views/data/classify/classify-details'], resolve);
const dataClassifyDel           = resolve => require(['../views/data/classify/classify-del'], resolve);

const dataLinkAdd               = resolve => require(['../views/data/link/link-add'], resolve);
const dataLinkEdit              = resolve => require(['../views/data/link/link-edit'], resolve);
const dataLinkDetails           = resolve => require(['../views/data/link/link-details'], resolve);
const dataLinkDel               = resolve => require(['../views/data/link/link-del'], resolve);

const dataUserAdd               = resolve => require(['../views/data/user/user-add'], resolve);
const dataUserEdit              = resolve => require(['../views/data/user/user-edit'], resolve);
const dataUserDetails           = resolve => require(['../views/data/user/user-details'], resolve);
const dataUserDel               = resolve => require(['../views/data/user/user-del'], resolve);

const dataArticleRecom          = resolve => require(['../views/data/recom/article-recom'], resolve);
const dataNoteRecom             = resolve => require(['../views/data/recom/note-recom'], resolve);
const dataBookRecom             = resolve => require(['../views/data/recom/book-recom'], resolve);



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
				{
					meta: { pId: '2' },
					path: 'data-comment-edit/details/:commentId',
					name: '评论详情',
					component: dataCommentDetails
				},
				{
					meta: { pId: '2' },
					path: 'data-comment-del',
					name: '删除评论',
					component: dataCommentDel
				},
                {
                    meta: { pId: '2' },
                    path: 'data-book-add',
                    name: '新增图书',
                    component: dataBookAdd
                },
				{
					meta: { pId: '2' },
					path: 'data-book-edit',
					name: '编辑图书',
					component: dataBookEdit
				},
                {
                    meta: { pId: '2' },
                    path: 'data-book-edit/:detailsId',
                    name: '图书详情',
                    component: dataBookDetails
                },
				{
					meta: { pId: '2' },
					path: 'data-book-del',
					name: '删除图书',
					component: dataBookDel
				},
				{
					meta: { pId: '2' },
					path: 'data-classify-add',
					name: '新增分类',
					component: dataClassifyAdd
				},
				{
					meta: { pId: '2' },
					path: 'data-classify-edit',
					name: '编辑分类',
					component: dataClassifyEdit
				},
				{
					meta: { pId: '2' },
					path: 'data-classify-edit/:detailsId',
					name: '分类详情',
					component: dataClassifyDetails
				},
				{
					meta: { pId: '2' },
					path: 'data-classify-del',
					name: '删除分类',
					component: dataClassifyDel
				},
				{
					meta: { pId: '2' },
					path: 'data-link-add',
					name: '新增外链',
					component: dataLinkAdd
				},
				{
					meta: { pId: '2' },
					path: 'data-link-edit',
					name: '编辑外链',
					component: dataLinkEdit
				},
				{
					meta: { pId: '2' },
					path: 'data-link-edit/:detailsId',
					name: '外链详情',
					component: dataLinkDetails
				},
				{
					meta: { pId: '2' },
					path: 'data-link-del',
					name: '删除外链',
					component: dataLinkDel
				},
				{
					meta: { pId: '2' },
					path: 'data-user-add',
					name: '新增用户',
					component: dataUserAdd
				},
				{
					meta: { pId: '2' },
					path: 'data-user-edit',
					name: '编辑用户',
					component: dataUserEdit
				},
				{
					meta: { pId: '2' },
					path: 'data-user-edit/:detailsId',
					name: '外链用户',
					component: dataUserDetails
				},
				{
					meta: { pId: '2' },
					path: 'data-user-del',
					name: '删除用户',
					component: dataUserDel
				},
				{
					meta: { pId: '2' },
					path: 'data-article-recom',
					name: '文章推荐量',
					component: dataArticleRecom,
				},
				{
					meta: { pId: '2' },
					path: 'data-note-recom',
					name: '笔记推荐量',
					component: dataNoteRecom,
				},
				{
					meta: { pId: '2' },
					path: 'data-book-recom',
					name: '图书推荐量',
					component: dataBookRecom,
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



/**
 * 用来存储框架页面数据（菜单、用户工具栏等）
 * @type {string}
 */

import Vue from 'vue';

// 更新选中菜单
export const SET_CHILDMENUSHOW   = 'fremework/SET_CHILDMENUSHOW';
export const SET_TOPACTIVEMENU   = 'fremework/SET_TOPACTIVEMENU';
export const SET_CHILDACTIVEMENU = 'fremework/SET_CHILDACTIVEMENU';
export const SET_UNREADCOMMENT   = 'fremework/SET_UNREADCOMMENT';

const state  = {
    childMenuShow   : true,
	topActiveMenu   : '',  // 顶级菜单当前选中项
	childActiveMenu : '',  // 子级菜单当前选中项
	menuList : [
		// pId为顶级菜单的id
		{
			'id': '1', 'icon': 'fa-bar-chart', 'name': '分析', 'level': 1, 'childMenu': [
				{
					'id': '1-1', 'pId': '1', 'icon': 'fa-pie-chart', 'name': '数据概览', 'level': 2, 'path': '/home/analyze-dashboard'
				},
				{
					'id': '1-2', 'icon': 'fa-file-text-o', 'name': '文章分析', 'level': 2, 'childMenu': [
						{'id': '1-2-1', 'pId': '1', 'name': '用户访问量', 'level': 3, 'path': '/home/analyze-article-pv'},
						{'id': '1-2-2', 'pId': '1', 'name': '数据分布', 'level': 3, 'path': '/home/analyze-article-data'}
					]
				},
				{
					'id': '1-3', 'icon': 'fa-file-code-o', 'name': '笔记分析', 'level': 2, 'childMenu': [
						{'id': '1-3-1', 'pId': '1', 'name': '用户访问量', 'level': 3, 'path': '/home/analyze-note-pv'},
						{'id': '1-3-2', 'pId': '1', 'name': '数据分布', 'level': 3, 'path': '/home/analyze-note-data'}
					]
				},
				{
					'id': '1-4', 'icon': 'fa-commenting-o', 'name': '评论分析', 'level': 2, 'childMenu': [
						{'id': '1-4-1', 'pId': '1', 'name': '评论热度值', 'level': 3, 'path': '/home/analyze-comment-heat'}
					]
				},
				{
					'id': '1-5', 'icon': 'fa-book', 'name': '图书分析', 'level': 2, 'childMenu': [
						{'id': '1-5-1', 'pId': '1', 'name': '图书热度值', 'level': 3, 'path': '/home/analyze-book-heat'}
					]
				}
			],
		},
		{
			'id' : '2', 'icon' : 'fa-database', 'name' : '数据管理', 'level' : 1, 'childMenu' : [
				{
					'id' : '2-1', 'pId': '2', 'icon' : 'fa-television', 'name' : '功能地图', 'level' : 2, 'path' : '/home/data-dashboard'
				},
				{
					'id' : '2-2', 'icon' : 'fa-file-text-o', 'name' : '文章管理', 'level' : 2, 'childMenu' : [
						{'id' : '2-2-1', 'pId': '2', 'name' : '新增文章', 'level' : 3, 'path' : '/home/data-article-add'},
                        {'id' : '2-2-2', 'pId': '2', 'name' : '编辑文章', 'level' : 3, 'path' : '/home/data-article-edit'},
						{'id' : '2-2-3', 'pId': '2', 'name' : '删除文章', 'level' : 3, 'path' : '/home/data-article-del'}
					]
				},
				{
					'id' : '2-3', 'icon' : 'fa-file-code-o', 'name' : '笔记管理', 'level' : 2, 'childMenu' : [
						{'id' : '2-3-1', 'pId': '2', 'name' : '新增笔记', 'level' : 3, 'path' : '/home/data-note-add'},
                        {'id' : '2-3-2', 'pId': '2', 'name' : '编辑笔记', 'level' : 3, 'path' : '/home/data-note-edit'},
                        {'id' : '2-3-3', 'pId': '2', 'name' : '删除笔记', 'level' : 3, 'path' : '/home/data-note-del'}
					]
				},
                {
                    'id' : '2-4', 'icon' : 'fa-commenting-o', 'name' : '评论管理', 'level' : 2, 'childMenu' : [
                        {'id' : '2-4-1', 'pId': '2', 'name' : '编辑评论', 'level' : 3, 'path' : '/home/data-comment-edit/2'},
                        {'id' : '2-4-2', 'pId': '2', 'name' : '删除评论', 'level' : 3, 'path' : '/home/data-comment-del'}
                    ]
                },
                {
                    'id' : '2-5', 'icon' : 'fa-book', 'name' : '图书管理', 'level' : 2, 'childMenu' : [
                        {'id' : '2-5-1', 'pId': '2', 'name' : '新增图书', 'level' : 3, 'path' : '/home/data-book-add'},
                        {'id' : '2-5-2', 'pId': '2', 'name' : '编辑图书', 'level' : 3, 'path' : '/home/data-book-edit'},
                        {'id' : '2-5-3', 'pId': '2', 'name' : '删除图书', 'level' : 3, 'path' : '/home/data-book-del'}
                    ]
                },
                {
                    'id' : '2-6', 'icon' : 'fa-qrcode', 'name' : '分类管理', 'level' : 2, 'childMenu' : [
                        {'id' : '2-6-1', 'pId': '2', 'name' : '新增分类', 'level' : 3, 'path' : '/home/data-classify-add'},
                        {'id' : '2-6-2', 'pId': '2', 'name' : '编辑分类', 'level' : 3, 'path' : '/home/data-classify-edit'},
                        {'id' : '2-6-3', 'pId': '2', 'name' : '删除分类', 'level' : 3, 'path' : '/home/data-classify-del'}
                    ]
                },
                {
                    'id' : '2-7', 'icon' : 'fa-chain', 'name' : '外链管理', 'level' : 2, 'childMenu' : [
                        {'id' : '2-7-1', 'pId': '2', 'name' : '新增外链', 'level' : 3, 'path' : '/home/data-link-add'},
                        {'id' : '2-7-2', 'pId': '2', 'name' : '编辑外链', 'level' : 3, 'path' : '/home/data-link-edit'},
                        {'id' : '2-7-3', 'pId': '2', 'name' : '删除外链', 'level' : 3, 'path' : '/home/data-link-del'}
                    ]
                },
                {
                    'id' : '2-8', 'icon' : 'fa-thumbs-o-up', 'name' : '推荐管理', 'level' : 2, 'childMenu' : [
                        {'id' : '2-8-1', 'pId': '2', 'name' : '文章推荐量', 'level' : 3, 'path' : '/home/data-article-recom'},
                        {'id' : '2-8-2', 'pId': '2', 'name' : '笔记推荐量', 'level' : 3, 'path' : '/home/data-note-recom'},
                        {'id' : '2-8-3', 'pId': '2', 'name' : '图书推荐量', 'level' : 3, 'path' : '/home/data-book-recom'}
                    ]
                },
                {
                    'id' : '2-9', 'icon' : 'fa-user-o', 'name' : '用户管理', 'level' : 2, 'childMenu' : [
                        {'id' : '2-9-1', 'pId': '2', 'name' : '新增用户', 'level' : 3, 'path' : '/home/data-user-add'},
                        {'id' : '2-9-2', 'pId': '2', 'name' : '编辑用户', 'level' : 3, 'path' : '/home/data-user-edit'},
                        {'id' : '2-9-3', 'pId': '2', 'name' : '删除用户', 'level' : 3, 'path' : '/home/data-user-del'}
                    ]
                }
			],
		},
		{
			'id' : '3', 'icon' : 'fa-cogs', 'name' : '系统设置', 'level' : 1, 'childMenu' : [
				{
					'id' : '3-1', 'pId': '3', 'icon' : 'fa-database', 'name' : '数据备份', 'level' : 2, 'path' : '/home/cog-backup'
				},
				{
					'id' : '3-2', 'pId': '3', 'icon' : 'fa-user-o', 'name' : '管理员设置', 'level' : 2, 'path' : '/home/cog-admin'
				},
			],
		},
		{
			'id' : '4', 'icon' : 'fa-picture-o', 'name' : '图库', 'level' : 1, 'childMenu' : [
				{
					'id' : '4-1', 'pId': '4', 'icon' : 'fa-picture-o', 'name' : '图库管理', 'level' : 2, 'path' : '/home/picture-dashboard'
				},
			]
		}
    ],
	unreadComment    : 0
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {

};

// actions
const actions = {
    // 因为框架中顶级菜单每切换一次，子菜单是需要重新渲染，所以使用v-if指令迫使浏览器引擎进行重新渲染
    // 从而完成顶级菜单切换后，子菜单的默认选中参数才会起作用
    setChildMenuShow ({ dispatch, commit, state, rootState }, menuShow) {
        return new Promise((resolve, reject) => {
            commit(SET_CHILDMENUSHOW, menuShow);
            resolve();
        })
    },
    // 顶级菜单切换
    setActiveTopMenu ({ dispatch, commit, state, rootState }, topMenu) {
        return new Promise((resolve, reject) => {
            commit(SET_TOPACTIVEMENU, topMenu);
            resolve();
        })
    },
    // 子级菜单切换
    setActiveChildMenu ({ dispatch, commit, state, rootState }, childMenu) {
	 	return new Promise((resolve, reject) => {
	 		commit(SET_CHILDACTIVEMENU, childMenu);
	 		resolve();
	 	})
    },
	// 获取未读评论
	getUnreadComment ({ dispatch, commit, state, rootState }) {
		return new Promise((resolve, reject) => {
			Vue.http.post(rootState.BASE_URL + '/commentAction/getUnreadCommentLength', {}, {
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				},
				emulateJSON: true
			}).then(function(response) {
				commit(SET_UNREADCOMMENT, response.data.data);
				resolve(response.data);
			});
		})
	},
};

// mutations
// action会发送请求到此，在此对state的值做设置处理
const mutations = {
    [SET_CHILDMENUSHOW](state , childMenuShow){
        state.childMenuShow = childMenuShow;
    },
	[SET_TOPACTIVEMENU](state , topActiveMenu){
		state.topActiveMenu = topActiveMenu;
	},
    [SET_CHILDACTIVEMENU](state , childActiveMenu){
        state.childActiveMenu = childActiveMenu;
    },
	[SET_UNREADCOMMENT](state , unreadComment){
		state.unreadComment = unreadComment;
	},
};

export default {
	state,
	getters,
	actions,
	mutations
};

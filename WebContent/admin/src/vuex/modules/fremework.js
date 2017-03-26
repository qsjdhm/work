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
				//{
				//	'id' : '2-1', 'pId': '2', 'icon' : 'fa-line-chart', 'name' : '功能地图', 'level' : 2, 'path' : '/home/data-dashboard'
				//},
				{
					'id' : '2-2', 'icon' : 'fa-line-chart', 'name' : '文章管理', 'level' : 2, 'childMenu' : [
						{'id' : '2-2-1', 'pId': '2', 'name' : '新增文章', 'level' : 3, 'path' : '/home/data-article-add'},
						{'id' : '2-2-2', 'pId': '2', 'name' : '删除文章', 'level' : 3, 'path' : '/home/data-article-del'}
					]
				},
				{
					'id' : '2-3', 'icon' : 'fa-line-chart', 'name' : '笔记管理', 'level' : 2, 'childMenu' : [
						{'id' : '2-3-1', 'pId': '1', 'name' : '新增笔记', 'level' : 3, 'path' : '/home/data-note-add'}
					]
				}
			],
		},
		{
			'id' : '3', 'icon' : 'fa-cogs', 'name' : '系统设置', 'level' : 1, 'childMenu' : [
				{
					'id' : '3-1', 'pId': '3', 'icon' : 'fa-line-chart', 'name' : '常规设置', 'level' : 2, 'path' : '/home/cog-convention'
				},
				{
					'id' : '3-2', 'pId': '3', 'icon' : 'fa-line-chart', 'name' : '个性化设置', 'level' : 2, 'path' : '/home/cog-personalized'
				},
			],
		},
		{
			'id' : '4', 'icon' : 'fa-picture-o', 'name' : '图库', 'level' : 1, 'childMenu' : [
				{
					'id' : '4-1', 'pId': '4', 'icon' : 'fa-line-chart', 'name' : '图库管理', 'level' : 2, 'path' : '/home/picture-dashboard'
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

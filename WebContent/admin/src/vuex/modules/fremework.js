/**
 * 用来存储框架页面数据（菜单、用户工具栏等）
 * @type {string}
 */

// 更新选中菜单
export const SET_CHILDMENUSHOW   = 'fremework/SET_CHILDMENUSHOW';
export const SET_TOPACTIVEMENU   = 'fremework/SET_TOPACTIVEMENU';
export const SET_CHILDACTIVEMENU = 'fremework/SET_CHILDACTIVEMENU';

const state  = {
	topActiveMenu   : '',  // 顶级菜单当前选中项
	childActiveMenu : '',  // 子级菜单当前选中项
	menuList : [
		{
			'id': '1', 'icon': 'fa-bar-chart', 'name': '分析', 'level': 1, 'childMenu': [
				{
					'id': '1-1', 'pId': '1', 'icon': 'fa-line-chart', 'name': '数据概览', 'level': 2, 'path': '/home/analyze-dashboard'
				},
				{
					'id': '1-2', 'icon': 'fa-line-chart', 'name': '文章分析', 'level': 2, 'childMenu': [
						{'id': '1-2-1', 'pId': '1', 'name': '地域分析', 'level': 3, 'path': '/home/analyze-article-territory'},
						{'id': '1-2-2', 'pId': '1', 'name': '数据分析', 'level': 3, 'path': '/home/analyze-article-data'}
					]
				},
				{
					'id': '1-3', 'icon': 'fa-line-chart', 'name': '评论分析', 'level': 2, 'childMenu': [
						{'id': '1-3-1', 'pId': '1', 'name': '地域分析', 'level': 3, 'path': '/home/analyze-comment-territory'}
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
    ]
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {

};

// actions
const actions = {
    setActiveTopMenu ({ dispatch, commit, state, rootState }, topMenu) {
        return new Promise((resolve, reject) => {
            commit(SET_TOPACTIVEMENU, topMenu);
            resolve();
        })
    },
    setActiveChildMenu ({ dispatch, commit, state, rootState }, childMenu) {
	 	return new Promise((resolve, reject) => {
	 		commit(SET_CHILDACTIVEMENU, childMenu);
	 		resolve();
	 	})
    }
};

// mutations
// action会发送请求到此，在此对state的值做设置处理
const mutations = {
	[SET_TOPACTIVEMENU](state , topActiveMenu){
		state.topActiveMenu = topActiveMenu;
	},
    [SET_CHILDACTIVEMENU](state , childActiveMenu){
        state.childActiveMenu = childActiveMenu;
    },
};

export default {
	state,
	getters,
	actions,
	mutations
};

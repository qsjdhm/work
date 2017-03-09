/**
 * 用来存储框架页面数据（菜单、用户工具栏等）
 * @type {string}
 */

// 更新选中菜单
export const SET_TOPACTIVEMENU = 'fremeworkPage/SET_TOPACTIVEMENU';


const state  = {
	topActiveMenu   : '1',  // 顶级菜单当前选中项
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
				{
					'id' : '2-1', 'pId': '2', 'icon' : 'fa-line-chart', 'name' : '功能地图', 'level' : 2, 'path' : '/home/data-dashboard'
				},
				{
					'id' : '2-2', 'icon' : 'fa-line-chart', 'name' : '文章管理', 'level' : 2, 'childMenu' : [
						{'id' : '2-2-1', 'pId': '2', 'name' : '新增文章', 'level' : 3, 'path' : '/home/data-add-article'},
						{'id' : '2-2-2', 'pId': '2', 'name' : '删除文章', 'level' : 3, 'path' : '/home/data-del-article'}
					]
				},
				{
					'id' : '2-3', 'icon' : 'fa-line-chart', 'name' : '笔记管理', 'level' : 2, 'childMenu' : [
						{'id' : '2-3-1', 'pId': '1', 'name' : '新增笔记', 'level' : 3, 'path' : '/home/data-add-note'}
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


		/*{icon:"fa-file-text-o",      "name":"文章管理",    "subMenu":[
			{"path":"/home/addArticle",      "name":"新增文章"},
			{"path":"/home/editArticle",     "name":"编辑文章"},
			{"path":"/home/delArticle",      "name":"删除文章"}
		]},
		{icon:"fa-file-code-o",           "name":"笔记管理",    "subMenu":[
			{"path":"/home/addNote",         "name":"新增笔记"},
			{"path":"/home/editNote",        "name":"编辑笔记"},
			{"path":"/home/delNote",         "name":"删除笔记"}
		]},
		{icon:"fa-file-word-o",           "name":"图书管理",    "subMenu":[
			{"path":"/home/addBook",         "name":"新增图书"},
			{"path":"/home/editBook",        "name":"编辑图书"},
			{"path":"/home/delBook",         "name":"删除图书"},
		]},
		{icon:"fa-envelope-o",        "name":"评论管理",    "subMenu":[
			{"path":"/home/editComment",     "name":"编辑评论"},
			{"path":"/home/delComment",      "name":"删除评论"}
		]},
		{icon:"fa-link",         "name":"外链管理",    "subMenu":[
			{"path":"/home/addLink",         "name":"新增外链"},
			{"path":"/home/editLink",        "name":"编辑外链"},
			{"path":"/home/delLink",         "name":"删除外链"}
		]},
		{icon:"fa-th-large",     "name":"分类管理",    "subMenu":[
			{"path":"/home/addSort",         "name":"新增分类"},
			{"path":"/home/editSort",        "name":"编辑分类"},
			{"path":"/home/delSort",         "name":"删除分类"}
		]},
		{icon:"fa-thumbs-o-up",           "name":"推荐管理",    "subMenu":[
			{"path":"/home/articleRecom",    "name":"文章推荐量"},
			{"path":"/home/noteRecom",       "name":"笔记推荐量"},
			{"path":"/home/bookRecom",       "name":"图书推荐量"}
		]},
		{icon:"fa-user-o",           "name":"用户管理",    "subMenu":[
			{"path":"/home/addUser",         "name":"新增用户"},
			{"path":"/home/editUser",        "name":"编辑用户"},
			{"path":"/home/delUser",         "name":"删除用户"}
		]},
		{icon:"fa-cog",         "name":"系统管理",    "subMenu":[
			{"path":"/home/dataBackup",       "name":"恢复备份"}
		]}*/
	],
	activeMenu : {
		'path' : '/home/dashboard',
		'name' : '数据概览'
	}  // 当前选中的菜单
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {

};

// actions
const actions = {
	// setCurrentMenu ({ dispatch, commit, state, rootState }, currentMenu) {
	// 	return new Promise((resolve, reject) => {
	// 		// 从菜单序列中组织得到当前的对象并设置
	// 		let obj = {};
	// 		if (currentMenu === '/home/dashboard') {
	// 			obj.path = '/home/dashboard';
	// 			obj.name = '数据概览';
	// 		} else {
	// 			// 循环activeMenu找出对应的菜单
	// 			for (let i = 0, iLen = state.menuList.length; i < iLen; i++) {
	// 				for (let j = 0, jLen = state.menuList[i].subMenu.length; j < jLen; j++) {
	// 					if (state.menuList[i].subMenu[j].path === currentMenu) {
	// 						obj.path = currentMenu;
	// 						obj.name = state.menuList[i].subMenu[j].name;
	// 						break;
	// 					}
	// 				}
	// 			}
	// 		}
	// 		commit(SET_ACTIVEMENU, obj);
	// 		resolve();
	// 	})
	// }
};

// mutations
// action会发送请求到此，在此对state的值做设置处理
const mutations = {
	[SET_TOPACTIVEMENU](state , topActiveMenu){
		state.topActiveMenu = topActiveMenu ;
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};

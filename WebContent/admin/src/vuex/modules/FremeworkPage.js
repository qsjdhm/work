/**
 * 用来存储框架页面数据（菜单、用户工具栏等）
 * @type {string}
 */

// 更新打开菜单
export const SET_OPENEDMENU = 'fremeworkPage/SET_OPENEDMENU';
// 更新选中菜单
export const SET_ACTIVEMENU = 'fremeworkPage/SET_ACTIVEMENU';


const state  = {
	menuList : [
		{"level":1,   icon:"file-text",      "name":"文章管理",    "subMenu":[
			{"path":"/home/addArticle",      "name":"新增文章"},
			{"path":"/home/editArticle",     "name":"编辑文章"},
			{"path":"/home/delArticle",      "name":"删除文章"}
		]},
		{"level":1,   icon:"copy",           "name":"笔记管理",    "subMenu":[
			{"path":"/home/addNote",         "name":"新增笔记"},
			{"path":"/home/editNote",        "name":"编辑笔记"},
			{"path":"/home/delNote",         "name":"删除笔记"}
		]},
		{"level":1,   icon:"book",           "name":"图书管理",    "subMenu":[
			{"path":"/home/addBook",         "name":"新增图书"},
			{"path":"/home/editBook",        "name":"编辑图书"},
			{"path":"/home/delBook",         "name":"删除图书"},
		]},
		{"level":1,   icon:"message",        "name":"评论管理",    "subMenu":[
			{"path":"/home/editComment",     "name":"编辑评论"},
			{"path":"/home/delComment",      "name":"删除评论"}
		]},
		{"level":1,   icon:"export",         "name":"外链管理",    "subMenu":[
			{"path":"/home/addLink",         "name":"新增外链"},
			{"path":"/home/editLink",        "name":"编辑外链"},
			{"path":"/home/delLink",         "name":"删除外链"}
		]},
		{"level":1,   icon:"appstore-o",     "name":"分类管理",    "subMenu":[
			{"path":"/home/addSort",         "name":"新增分类"},
			{"path":"/home/editSort",        "name":"编辑分类"},
			{"path":"/home/delSort",         "name":"删除分类"}
		]},
		{"level":1,   icon:"like",           "name":"推荐管理",    "subMenu":[
			{"path":"/home/articleRecom",    "name":"文章推荐量"},
			{"path":"/home/noteRecom",       "name":"笔记推荐量"},
			{"path":"/home/bookRecom",       "name":"图书推荐量"}
		]},
		{"level":1,   icon:"user",           "name":"用户管理",    "subMenu":[
			{"path":"/home/addUser",         "name":"新增用户"},
			{"path":"/home/editUser",        "name":"编辑用户"},
			{"path":"/home/delUser",         "name":"删除用户"}
		]},
		{"level":1,   icon:"setting",         "name":"系统管理",    "subMenu":[
			{"path":"/home/dataBackup",       "name":"恢复备份"}
		]}
	],
	openedMenu : '',  // 打开的父菜单
	activeMenu : 'dashboard',  // 当前选中的菜单
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {

};

// actions
const actions = {
	// loginSystem ({ dispatch, commit, state, rootState }) {
	// 	return new Promise((resolve, reject) => {
	// 		// 向后端发送请求
	// 		fetch(rootState.BASE_URL + '/loginAction', {
	// 			method: 'POST',
	// 			credentials: 'include',
	// 			headers: {
	// 				"Content-Type": 'application/x-www-form-urlencoded; charset=utf-8'
	// 			},
	// 			body: 'name='+state.username+'&password='+state.password
	// 		}).then(function(res) {
     //            resolve(res.json());
	// 		});
	// 	})
	// }
};

// mutations
// action会发送请求到此，在此对state的值做设置处理
const mutations = {
	[SET_OPENEDMENU](state , openedMenu){
		state.openedMenu = openedMenu ;
	},
	[SET_ACTIVEMENU](state , activeMenu){
		console.info(activeMenu);
		state.activeMenu = activeMenu ;
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};

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
		{"level":1,   icon:"copy",           "name":"笔记管理",  "index":"noteMan",  "subMenu":[
			{"path":"/home/addNote",         "name":"新增笔记", "index":"addNote"},
			{"path":"/home/delNote",         "name":"删除笔记", "index":"delNote"}
		]},
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

/**
 * 用来存储框架页面数据（菜单、用户工具栏等）
 * @type {string}
 */

// export const dSET_USERNAME = 'dloginPage/SET_USERNAME';
// export const dSET_PASSWORD = 'dloginPage/SET_PASSWORD';
import Vue from 'vue';

const state  = {

};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {

};

// actions
const actions = {
	// 获取总览总数
	getAnalyzeCount ({ dispatch, commit, state, rootState }) {
		return new Promise((resolve, reject) => {
			Vue.http.post(rootState.BASE_URL + '/analyzeAction/getAnalyzeCount', {
				// 参数部分
			}, {
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				},
				emulateJSON: true
			}).then(function(response) {
				resolve(response.data);
			}, function(response) {
				console.error(response);
				resolve(response.json());
			});
		})
	}
}

// mutations
// action会发送请求到此，在此对state的值做设置处理
const mutations = {
	// [dSET_USERNAME](state , username){
	// 	state.username = username ;
	// },
	// [dSET_PASSWORD](state , password){
	// 	state.password = password ;
	// }
}

export  default {
	state,
	getters,
	actions,
	mutations
}

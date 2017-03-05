

export const SET_USERNAME = 'loginPage/SET_USERNAME';
export const SET_PASSWORD = 'loginPage/SET_PASSWORD';


const state  = {
	// 查询条件
	username : 'qsjdhm',
	// 查询结果
	password : 'z000000'
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {};

// actions
const actions = {
	loginSystem ({ dispatch, commit, state, rootState }) {
		return new Promise((resolve, reject) => {
			// 向后端发送请求
			fetch(rootState.BASE_URL + '/loginAction', {
				method: 'POST',
				credentials: 'include',
				headers: {
					"Content-Type": 'application/x-www-form-urlencoded; charset=utf-8'
				},
				body: 'name='+state.username+'&password='+state.password
			}).then(function(res) {
                resolve(res.json());
			});
		})
	}
}

// mutations
// action会发送请求到此，在此对state的值做设置处理
const mutations = {
	[SET_USERNAME](state , username){
		state.username = username ;
	},
	[SET_PASSWORD](state , password){
		state.password = password ;
	}
}

export  default {
	state,
	getters,
	actions,
	mutations
}

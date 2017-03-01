

export const SET_USERNAME = 'SET_USERNAME';
export const SET_PASSWORD = 'SET_PASSWORD';


const state  = {
	// 查询条件
	username : 'adsad',
	// 查询结果
	password : 'ffff'
}

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
	//username: function (state) {
	//	return state.username;
	//},
	//password: function (state) {
	//	// 可以在此做数据过滤、组织等处理
	//	return state.password;
	//}
}

// actions
const actions = {
	login ({ dispatch, commit, state, rootState }, param) {
		return new Promise((resolve, reject) => {
			console.info('login-------11');
			console.info(param.username);
			console.info(param.password);
			commit(SET_USERNAME, param.username);
			commit(SET_PASSWORD, param.password);

			console.info('login-------22');
			console.info(state.username);
			console.info(state.password);


			// 向后端发送请求
			//fetch(process.env.baseUrl + '/loginAction', {
			//	method: 'POST',
			//	credentials: 'include',
			//	headers: {
			//		"Content-Type": 'application/x-www-form-urlencoded; charset=utf-8'
			//	},
			//	body: 'name='+state.username+'&password='+state.password
			//}).then(function(res) {
			//	if (res.ok) {
			//		return res.json();
			//	} else {
			//		console.error('登录错误');
			//	}
			//});

			resolve();
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

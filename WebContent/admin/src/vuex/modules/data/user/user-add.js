/**
 * 数据模块 - 新增用户模块
 */

import Vue from 'vue';

export const SET_NAME = 'data-user-add/SET_NAME';
export const SET_PASSWORD = 'data-user-add/SET_PASSWORD';
export const SET_EMAIL = 'data-user-add/SET_EMAIL';
export const SET_ISSUBMIT = 'data-user-add/SET_ISSUBMIT';

export const SUBMIT_DATA = 'data-user-add/SUBMIT_DATA';

const state  = {
    name : '',  // 名称
	password : '',  // 密码
    email: '',  // 邮箱
    isSubmit: false  // 当前是否是提交数据状态
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
};

// actions
const actions = {
    // 添加用户
    [SUBMIT_DATA] (context, payload) {
        let self = this;
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/userAction/addUser', {
                // 参数部分
                "name"     : encodeURI(encodeURI(context.state.name)),
                "password" : encodeURI(encodeURI(context.state.password)),
				"email"    : encodeURI(encodeURI(context.state.email))
            }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                resolve(response);
            }, function(response) {
                resolve(response.json());
            });
        })
    },
};

// mutations
// action会发送请求到此，在此对state的值做设置处理
const mutations = {
    [SET_NAME](state , name){
        state.name = name;
    },
	[SET_PASSWORD](state , password){
		state.password = password;
	},
    [SET_EMAIL](state , email){
        state.email = email;
    },
    [SET_ISSUBMIT](state , isSubmit){
        state.isSubmit = isSubmit;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};

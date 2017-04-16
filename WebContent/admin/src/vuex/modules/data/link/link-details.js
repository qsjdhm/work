/**
 * 数据模块 - 编辑外链详情
 */

import Vue from 'vue';

export const SET_ID = 'data-link-add/SET_ID';
export const SET_NAME = 'data-link-add/SET_NAME';
export const SET_LINK = 'data-link-add/SET_LINK';
export const SET_ISSUBMIT = 'data-link-add/SET_ISSUBMIT';

export const GET_LINK = 'data-link-details/GET_LINK';
export const SUBMIT_DATA = 'data-link-details/SUBMIT_DATA';

const state  = {
    id : '',  // id
    name : '',  // 名称
    link: '',  // 链接
    isSubmit: false  // 当前是否是提交数据状态
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
};

// actions
const actions = {
    // 根据id获取外链
	[GET_LINK] (context, payload) {
		return new Promise((resolve, reject) => {
			Vue.http.post(context.rootState.BASE_URL + '/linkAction/getLink', {
				// 参数部分
				"selectId"   : context.state.id,
			}, {
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				},
				emulateJSON: true
			}).then(function(response) {
				// 设置页面元素内容
                context.commit(SET_NAME, response.data.name);
                context.commit(SET_LINK, response.data.url);
				resolve(response);
			}, function(response) {
				resolve(response.json());
			});
		})
	},
    // 修改笔记
    [SUBMIT_DATA] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/linkAction/updateLink', {
                "id"       : context.state.id,
                "name"     : encodeURI(encodeURI(context.state.name)),
                "url"      : context.state.link.replace(/&/g, "*")
            }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                //context.commit(SET_TAGLIST, tempTagList);
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
    [SET_ID](state , id){
        state.id = id;
    },
    [SET_NAME](state , name){
        state.name = name;
    },
    [SET_LINK](state , link){
        state.link = link;
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

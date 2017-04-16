/**
 * 数据模块 - 编辑分类详情
 */

import Vue from 'vue';

export const SET_CLASSIFY = 'data-classify-add/SET_CLASSIFY';
export const SET_ID = 'data-classify-add/SET_ID';
export const SET_NAME = 'data-classify-add/SET_NAME';
export const SET_ISSUBMIT = 'data-classify-add/SET_ISSUBMIT';

export const GET_CLASSIFY = 'data-classify-details/GET_CLASSIFY';
export const SUBMIT_DATA = 'data-classify-details/SUBMIT_DATA';

const state  = {
    sortList : [{value: '3', label: '图书分类'},{value: '8', label: '笔记分类'},{value: '4', label: '标签分类'}],  // 分类数据列表
    classify : '',  // 选中的分类
    id : '',  // id
    name : '',  // 名称
    isSubmit: false  // 当前是否是提交数据状态
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
};

// actions
const actions = {
    // 根据id获取分类
	[GET_CLASSIFY] (context, payload) {
		return new Promise((resolve, reject) => {
			Vue.http.post(context.rootState.BASE_URL + '/sortAction/getSort', {
				// 参数部分
				"selectId"   : context.state.id,
			}, {
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				},
				emulateJSON: true
			}).then(function(response) {
				// 设置页面元素内容
				context.commit(SET_CLASSIFY, response.data.fId);
				context.commit(SET_ID, response.data.id);
                context.commit(SET_NAME, response.data.name);
				resolve(response);
			}, function(response) {
				resolve(response.json());
			});
		})
	},
    // 修改笔记
    [SUBMIT_DATA] (context, payload) {
        return new Promise((resolve, reject) => {
            // 处理下分类名称
            let classifyName = '';
            for (let i = 0, len = context.state.sortList.length; i < len; i++) {
                if (context.state.sortList[i].value === context.state.classify) {
                    classifyName = context.state.sortList[i].label;
                    break;
                }
            }
            Vue.http.post(context.rootState.BASE_URL + '/sortAction/updateSort', {
                "id"       : context.state.id,
                "name"     : encodeURI(encodeURI(context.state.name)),
                "fId"   : context.state.classify
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
    [SET_CLASSIFY](state , classify){
        state.classify = classify;
    },
    [SET_ID](state , id){
        state.id = id;
    },
    [SET_NAME](state , name){
        state.name = name;
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

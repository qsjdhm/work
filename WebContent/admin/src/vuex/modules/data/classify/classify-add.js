/**
 * 数据模块 - 新增分类模块
 */

import Vue from 'vue';

export const SET_CLASSIFY = 'data-classify-add/SET_CLASSIFY';
export const SET_NAME = 'data-classify-add/SET_NAME';
export const SET_ISSUBMIT = 'data-classify-add/SET_ISSUBMIT';

export const SUBMIT_DATA = 'data-classify-add/SUBMIT_DATA';

const state  = {
    sortList : [{value: '3', label: '图书分类'},{value: '8', label: '笔记分类'},{value: '4', label: '标签分类'}],  // 分类数据列表
    classify : '3',  // 选中的父分类
    name : '',  // 名称
    isSubmit: false  // 当前是否是提交数据状态
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
};

// actions
const actions = {
    // 添加分类
    [SUBMIT_DATA] (context, payload) {
        let self = this;
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/sortAction/addSort', {
                // 参数部分
                "fSortId"   : context.state.classify,
				"sortName"     : encodeURI(encodeURI(context.state.name))
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
    [SET_CLASSIFY](state , classify){
        state.classify = classify;
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

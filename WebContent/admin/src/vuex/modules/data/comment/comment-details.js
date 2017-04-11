/**
 * 数据模块 - 评论详情
 */

import Vue from 'vue';

export const SET_ID = 'data-comment-details/SET_ID';
export const SET_NAME = 'data-comment-details/SET_NAME';
export const SET_CONTENT = 'data-comment-details/SET_CONTENT';
export const SET_ARTICLETITLE = 'data-comment-details/SET_ARTICLETITLE';


export const GET_COMMENT = 'data-comment-details/GET_ARTICLE';


const state  = {
    id : '',   // 评论id
    name : '',  // 评论人名称
    content : '',  // 评论内容
	articleTitle : '',  // 文章标题
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
};

// actions
const actions = {
    // 根据id获取评论
    [GET_COMMENT] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/commentAction/getComment', {
                // 参数部分
                "selectId"   : context.state.id,
            }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                // 设置页面元素内容
				context.commit(SET_NAME, response.data.userName);
				context.commit(SET_CONTENT, response.data.content);
				context.commit(SET_ARTICLETITLE, response.data.articleTitle);
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
    [SET_CONTENT](state , content){
        state.content = content;
    },
    [SET_ARTICLETITLE](state , articleTitle){
        state.articleTitle = articleTitle;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};

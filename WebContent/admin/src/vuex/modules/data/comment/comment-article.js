/**
 * 数据模块 - 评论下的文章列表
 */

import Vue from 'vue';

export const SET_ARTICLEID = 'data-comment-article/SET_ARTICLEID';
export const SET_ARTICLETITLE = 'data-comment-article/SET_ARTICLETITLE';
export const SET_COMMENTLIST = 'data-comment-article/SET_COMMENTLIST';


export const GET_ARTICLE = 'data-comment-article/GET_ARTICLE';
export const GET_COMMENTLIST = 'data-comment-article/GET_COMMENTLIST';


const state  = {
    articleId : '',  // 文章id
    articleTitle : '',  // 文章标题
    commentList : []  // 文章的评论列表
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
};

// actions
const actions = {
    // 根据id获取文章
    [GET_ARTICLE] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/articleAction/getArticle', {
                // 参数部分
                "selectId"   : context.state.articleId,
            }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                // 设置页面元素内容
                context.commit(SET_ARTICLETITLE, response.data.title);
                resolve(response);
            }, function(response) {
                resolve(response.json());
            });
        })
    },
    // 根据文章id获取评论列表
    [GET_COMMENTLIST] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/commentAction/getCommentByArticle', {
                // 参数部分
                "id"   : context.state.articleId,
            }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                // 初始化表格数据
                context.commit(SET_COMMENTLIST, response.data.data);
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
    [SET_ARTICLEID](state , articleId){
        state.articleId = articleId;
    },
    [SET_ARTICLETITLE](state , articleTitle){
        state.articleTitle = articleTitle;
    },
    [SET_COMMENTLIST](state , commentList){
        state.commentList = commentList;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};

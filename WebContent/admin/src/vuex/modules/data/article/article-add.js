/**
 * 分析模块 - 仪表盘模块
 */

import Vue from 'vue';

export const SET_SORTLIST = 'data-article-add/SET_SORTLIST';
export const SET_CLASSIFY = 'data-article-add/SET_CLASSIFY';
export const SET_NAME = 'data-article-add/SET_NAME';
export const SET_TAGLIST = 'data-article-add/SET_TAGLIST';
export const SET_TAG = 'data-article-add/SET_TAG';


export const GET_SORTLIST = 'data-article-add/GET_SORTLIST';
export const GET_TAGLIST = 'data-article-add/GET_TAGLIST';

export const SUBMIT_DATA = 'data-article-add/SUBMIT_DATA';

const state  = {
    sortList : [],  // 分类数据列表
    classify : '',  // 选中的分类
    name : '',  // 起始日期
    tagList : [],  // 标签列表
    tag : [],  // 选中的标签
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
};

// actions
const actions = {
    // 获取每个大分类下的小分类列表（例如：文章下的小分类）
    [GET_SORTLIST] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/sortAction/byTypeGetSort', {
                // 参数部分
                'type' : 'article'
            }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                // 处理下子分类数据
                var data = response.data.data;
                var tempSortList = [];
                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                        // 赋值默认分类选中项
                        context.commit(SET_CLASSIFY, data[i].Sort_ID);
                    }
                    tempSortList.push({value: data[i].Sort_ID, label: data[i].Sort_Name});
                }
                context.commit(SET_SORTLIST, tempSortList);
                resolve();
            }, function(response) {
                resolve(response.json());
            });
        })
    },
    // 获取标签列表
    [GET_TAGLIST] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/sortAction/byTypeGetSort', {
                // 参数部分
                'type' : 'tag'
            }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                // 处理下分类数据
                var data = response.data.data;
                var tempTagList = [];
                for (var i = 0; i < data.length; i++) {
                    tempTagList.push({value: data[i].Sort_ID, label: data[i].Sort_Name});
                }
                context.commit(SET_TAGLIST, tempTagList);
                resolve();
            }, function(response) {
                resolve(response.json());
            });
        })
    },

    // 添加文章
    [SUBMIT_DATA] (context, payload) {
        return new Promise((resolve, reject) => {
            console.info(context.state.tag);
            console.info(context.state.tag);
            console.info(context.state.tag);
            console.info(context.state.tag);
            //Vue.http.post(context.rootState.BASE_URL + '/sortAction/byTypeGetSort', {
            //    // 参数部分
            //    'type' : 'tag'
            //}, {
            //    headers: {
            //        "X-Requested-With": "XMLHttpRequest"
            //    },
            //    emulateJSON: true
            //}).then(function(response) {
            //    // 处理下分类数据
            //    var data = response.data.data;
            //    var tempTagList = [];
            //    for (var i = 0; i < data.length; i++) {
            //        tempTagList.push({value: data[i].Sort_ID, label: data[i].Sort_Name});
            //    }
            //    context.commit(SET_TAGLIST, tempTagList);
            //    resolve();
            //}, function(response) {
            //    resolve(response.json());
            //});
        })
    },
};

// mutations
// action会发送请求到此，在此对state的值做设置处理
const mutations = {
    [SET_SORTLIST](state , sortList){
        state.sortList = sortList;
    },
    [SET_CLASSIFY](state , classify){
        state.classify = classify;
    },
    [SET_NAME](state , name){
        state.name = name;
    },
    [SET_TAGLIST](state , tagList){
        state.tagList = tagList;
    },
    [SET_TAG](state , tag){
        console.info(tag);
        console.info(tag);
        console.info(tag);
        console.info(tag);
        console.info(tag);

        state.tag = tag;
    },

};

export default {
    state,
    getters,
    actions,
    mutations
};

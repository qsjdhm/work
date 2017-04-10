/**
 * 数据模块 - 新增笔记模块
 */

import Vue from 'vue';

export const SET_SORTLIST = 'data-note-add/SET_SORTLIST';
export const SET_CLASSIFY = 'data-note-add/SET_CLASSIFY';
export const SET_NAME = 'data-note-add/SET_NAME';
export const SET_CONTENT = 'data-note-add/SET_CONTENT';
export const SET_TAGLIST = 'data-note-add/SET_TAGLIST';
export const SET_TAG = 'data-note-add/SET_TAG';
export const SET_ISSUBMIT = 'data-note-add/SET_ISSUBMIT';

export const GET_SORTLIST = 'data-note-add/GET_SORTLIST';
export const GET_TAGLIST = 'data-note-add/GET_TAGLIST';
export const SUBMIT_DATA = 'data-note-add/SUBMIT_DATA';

const state  = {
    sortList : [],  // 分类数据列表
    classify : '',  // 选中的分类
    name : '',  // 起始日期
    content : '',  // 内容
    tagList : [],  // 标签列表
    tag : [],  // 选中的标签
    isSubmit: false  // 当前是否是提交数据状态
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
};

// actions
const actions = {
    // 获取每个大分类下的小分类列表（例如：笔记下的小分类）
    [GET_SORTLIST] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/sortAction/byTypeGetSort', {
                // 参数部分
                'type' : 'note'
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
                    tempTagList.push({value: data[i].Sort_Name, label: data[i].Sort_Name});
                }
                context.commit(SET_TAGLIST, tempTagList);
                resolve();
            }, function(response) {
                resolve(response.json());
            });
        })
    },
    // 添加笔记
    [SUBMIT_DATA] (context, payload) {
        let self = this;
        return new Promise((resolve, reject) => {
            // 处理下分类名称
            let classifyName = '';
            for (let i = 0, len = context.state.sortList.length; i < len; i++) {
                if (context.state.sortList[i].value === context.state.classify) {
                    classifyName = context.state.sortList[i].label;
                    break;
                }
            }
            Vue.http.post(context.rootState.BASE_URL + '/noteAction/addNote', {
                // 参数部分
                "sortId"   : context.state.classify,
                "sortName" : encodeURI(encodeURI(classifyName)),
                "title"    : encodeURI(encodeURI(context.state.name)),
                "content"  : encodeURI(encodeURI(context.state.content)),
                "tags"     : encodeURI(encodeURI(context.state.tag.join(",")))
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
    [SET_SORTLIST](state , sortList){
        state.sortList = sortList;
    },
    [SET_CLASSIFY](state , classify){
        state.classify = classify;
    },
    [SET_NAME](state , name){
        state.name = name;
    },
    [SET_CONTENT](state , content){
        state.content = content;
    },
    [SET_TAGLIST](state , tagList){
        state.tagList = tagList;
    },
    [SET_TAG](state , tag){
        state.tag = tag;
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

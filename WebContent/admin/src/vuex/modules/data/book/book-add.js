/**
 * 数据模块 - 新增图书模块
 */

import Vue from 'vue';

export const SET_SORTLIST = 'data-book-add/SET_SORTLIST';
export const SET_CLASSIFY = 'data-book-add/SET_CLASSIFY';
export const SET_NAME = 'data-book-add/SET_NAME';
export const SET_HEIGHT = 'data-book-add/SET_HEIGHT';
export const SET_COVER = 'data-book-add/SET_COVER';
export const SET_LINK = 'data-book-add/SET_LINK';
export const SET_ISSUBMIT = 'data-book-add/SET_ISSUBMIT';

export const GET_SORTLIST = 'data-book-add/GET_SORTLIST';
export const SUBMIT_DATA = 'data-book-add/SUBMIT_DATA';

const state  = {
    sortList : [],  // 分类数据列表
    classify : '',  // 选中的分类
    name : '',  // 名称
    height : '',  // 高度
    cover : '',  // 封面
    link: '',  // 链接
    isSubmit: false  // 当前是否是提交数据状态
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
                'type' : 'book'
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
    // 添加图书
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
            Vue.http.post(context.rootState.BASE_URL + '/bookAction/addBook', {
                // 参数部分
                "name"     : encodeURI(encodeURI(context.state.name)),
                "sortId"   : context.state.classify,
                "sortName" : encodeURI(encodeURI(classifyName)),
                "height"   : context.state.height,
                "cover"    : context.state.cover,
                "link"     : context.state.link.replace(/&/g, "*")
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
    [SET_HEIGHT](state , height){
        state.height = height;
    },
    [SET_COVER](state , cover){
        state.cover = cover;
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

/**
 * 图库模块 - 图库管理
 */

import Vue from 'vue';

export const SET_SORTLIST = 'picture-dashboard/SET_SORTLIST';
export const SET_CLASSIFY = 'picture-dashboard/SET_CLASSIFY';
export const SET_STARTTIME = 'picture-dashboard/SET_STARTTIME';  // 起始日期
export const SET_ENDTIME = 'picture-dashboard/SET_ENDTIME';  // 结束日期

export const SET_LISTCOUNT = 'picture-dashboard/SET_LISTCOUNT';  // 当前表格数据总数
export const SET_LISTPAGE = 'picture-dashboard/SET_LISTPAGE';  // 当前表格当前页数
export const SET_LISTDATA = 'picture-dashboard/SET_LISTDATA';  // 当前表格当前数据

export const GET_SORTLIST = 'picture-dashboard/GET_SORTLIST';  // 获取分类列表
export const GET_LISTDATACOUNT = 'picture-dashboard/GET_LISTDATACOUNT';  // 根据根据父分类、子分类、时间区间获取表格数据总数--用来设置page
export const GET_LISTDATA = 'picture-dashboard/GET_LISTDATA';  // 根据根据子分类、时间区间获取表格数据--用来设置表格



const state  = {
    sortList : [{value: '1', label: '文章图片'},{value: '2', label: '图书图片'}],  // 分类数据列表
    classify : '1',  // 选中的分类
    startTime : '',  // 起始日期
    endTime : '',  // 结束日期
    listCount : 0,  // 表格数据总数
    listPage : 1,  // 表格当前页
    listData : [],  // 表格数据
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
};

// actions
const actions = {
    // 根据根据子分类、时间区间获取表格数据--用来设置表格
    [GET_LISTDATA] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/pictureAction/getPictureList', {
                type : context.state.classify,
                start: context.state.startTime,
                end  : context.state.endTime,
                page : context.state.listPage,
                size : 19
            }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                // 初始化表格数据
                context.commit(SET_LISTCOUNT, response.data.count);
                context.commit(SET_LISTDATA, response.data.data);
                resolve(response.data.data);
            }, function(response) {
                context.commit(SET_LISTDATA, []);
                resolve(response.json());
            });
        })
    }
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
    [SET_STARTTIME](state , startTime){
        state.startTime = startTime;
    },
    [SET_ENDTIME](state , endTime){
        state.endTime = endTime;
    },
    [SET_LISTCOUNT](state , listCount){
        state.listCount = listCount;
    },
    [SET_LISTPAGE](state , listPage){
        state.listPage = listPage;
    },
    [SET_LISTDATA](state , listData){
        let tempData = [];
        // 根据不同的父类型，要处理下数据
        for (let i = 0, len = listData.length; i < len; i++) {
            tempData.push({
                'Picture_Name' : listData[i].Picture_Name,
                'Picture_Size' : listData[i].Picture_Size,
                'Picture_Time' : listData[i].Picture_Time
            });
        }

        state.listData = tempData;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};

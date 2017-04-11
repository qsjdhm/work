/**
 * 数据模块 - 编辑文章
 */

import Vue from 'vue';

export const SET_SORTLIST = 'data-article-edit/SET_SORTLIST';
export const SET_CLASSIFY = 'data-article-edit/SET_CLASSIFY';
export const SET_STARTTIME = 'data-article-edit/SET_STARTTIME';  // 起始日期
export const SET_ENDTIME = 'data-article-edit/SET_ENDTIME';  // 结束日期
export const SET_SEQ = 'data-article-edit/SET_SEQ';  // 排序字段
export const SET_DESC = 'data-article-edit/SET_DESC';  // 排序规则

export const SET_TABLECOUNT = 'data-article-edit/SET_TABLECOUNT';  // 当前表格数据总数
export const SET_TABLEPAGE = 'data-article-edit/SET_TABLEPAGE';  // 当前表格当前页数
export const SET_TABLEDATA = 'data-article-edit/SET_TABLEDATA';  // 当前表格当前数据

export const GET_SORTLIST = 'data-article-edit/GET_SORTLIST';  // 获取分类列表
export const GET_TABLEDATACOUNT = 'data-article-edit/GET_TABLEDATACOUNT';  // 根据根据父分类、子分类、时间区间获取表格数据总数--用来设置page
export const GET_TABLEDATA = 'data-article-edit/GET_TABLEDATA';  // 根据根据子分类、时间区间获取表格数据--用来设置表格



const state  = {
    sortList : [],  // 分类数据列表
    classify : '',  // 选中的分类
    startTime : '',  // 起始日期
    endTime : '',  // 结束日期
	seq : 'Article_Date',  // 排序字段
	desc : 'desc',  // 排序规则
    tableCount : 0,  // 表格数据总数
    tablePage : 1,  // 表格当前页
    tableData : [],  // 表格数据
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
                        tempSortList.push({value: '0', label: '全部'});
						tempSortList.push({value: data[i].Sort_ID, label: data[i].Sort_Name});
                    } else {
                        tempSortList.push({value: data[i].Sort_ID, label: data[i].Sort_Name});
                    }
                }
                context.commit(SET_SORTLIST, tempSortList);
                // 每一次获取子分类列表都要选中“全部”
                context.commit(SET_CLASSIFY, '0');
                resolve();
            }, function(response) {
                // 请求错误情况下只显示全部，并且是选中状态
                context.commit(SET_SORTLIST, [{value: '0', label: '全部'}]);
                context.commit(SET_CLASSIFY, '');
                resolve(response.json());
            });
        })
    },
    // 根据根据分类、时间区间获取表格数据总数--用来设置page
    [GET_TABLEDATACOUNT] (context, payload) {
        return new Promise((resolve, reject) => {
            console.info(context.state.classify);
            Vue.http.post(context.rootState.BASE_URL + '/articleAction/getArticleCount', {
                sort : context.state.classify,
                start: context.state.startTime,
                end  : context.state.endTime,
            }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                // 初始化表格总数和当前页索引
                context.commit(SET_TABLECOUNT, response.data.data);
                context.commit(SET_TABLEPAGE, 1);
                resolve(response.data.data);
            }, function(response) {
                console.error(response);
                resolve(response.json());
            });
        });
    },
    // 根据根据子分类、时间区间获取表格数据--用来设置表格
    [GET_TABLEDATA] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/articleAction/getArticleList', {
                sort : context.state.classify,
                start: context.state.startTime,
                end  : context.state.endTime,
				seq  : context.state.seq,
				desc : context.state.desc,
                page : context.state.tablePage,
                size : 20
            }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                // 初始化表格数据
                context.commit(SET_TABLEDATA, response.data.data);
                resolve(response.data.data);
            }, function(response) {
                context.commit(SET_TABLEDATA, []);
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
	[SET_SEQ](state , seq){
		state.seq = seq;
	},
	[SET_DESC](state , desc){
		state.desc = desc;
	},
    [SET_TABLECOUNT](state , tableCount){
        state.tableCount = tableCount;
    },
    [SET_TABLEPAGE](state , tablePage){
        state.tablePage = tablePage;
    },
    [SET_TABLEDATA](state , tableData){
        let tempData = [];
        // 根据不同的父类型，要处理下数据
        for (let i = 0, len = tableData.length; i < len; i++) {
            tempData.push({
                'Article_ID' : tableData[i].Article_ID,
                'Article_Title' : tableData[i].Article_Title,
                'Sort_Name' : tableData[i].Sort_Name,
                'Article_Tag' : tableData[i].Article_Tag,
                'Comment_Num' : tableData[i].Comment_Num,
				'Comment_List' : tableData[i].Comment_List,
				'Uncomment_Num' : tableData[i].Uncomment_Num,
				'Uncomment_List' : tableData[i].Uncomment_List,
                'Read_Num' : tableData[i].Read_Num,
                'Article_Date' : tableData[i].Article_Date
            });
        }

        state.tableData = tempData;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};

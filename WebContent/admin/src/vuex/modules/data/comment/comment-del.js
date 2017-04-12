/**
 * 数据模块 - 删除评论
 */

import Vue from 'vue';

export const SET_CLASSIFY = 'data-comment-del/SET_CLASSIFY';
export const SET_STARTTIME = 'data-comment-del/SET_STARTTIME';  // 起始日期
export const SET_ENDTIME = 'data-comment-del/SET_ENDTIME';  // 结束日期
export const SET_SEQ = 'data-comment-del/SET_SEQ';  // 排序字段
export const SET_DESC = 'data-comment-del/SET_DESC';  // 排序规则

export const SET_TABLECOUNT = 'data-comment-del/SET_TABLECOUNT';  // 当前表格数据总数
export const SET_TABLEPAGE = 'data-comment-del/SET_TABLEPAGE';  // 当前表格当前页数
export const SET_TABLEDATA = 'data-comment-del/SET_TABLEDATA';  // 当前表格当前数据

export const GET_TABLEDATACOUNT = 'data-comment-del/GET_TABLEDATACOUNT';  // 根据根据父分类、子分类、时间区间获取表格数据总数--用来设置page
export const GET_TABLEDATA = 'data-comment-del/GET_TABLEDATA';  // 根据根据子分类、时间区间获取表格数据--用来设置表格
export const DEL_COMMENT = 'data-comment-del/DEL_COMMENT';  // 删除笔记



const state  = {
	sortList : [{value: '2', label: '全部'}, {value: '0', label: '未读'}, {value: '1', label: '已读'}],  // 分类数据列表
	classify : '2',  // 选中的分类
    startTime : '',  // 起始日期
    endTime : '',  // 结束日期
	seq : 'Comment_Time',  // 排序字段
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
    // 根据根据分类、时间区间获取表格数据总数--用来设置page
    [GET_TABLEDATACOUNT] (context, payload) {
        return new Promise((resolve, reject) => {
			Vue.http.post(context.rootState.BASE_URL + '/commentAction/getCommentCount', {
				type : context.state.classify,
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
            Vue.http.post(context.rootState.BASE_URL + '/commentAction/getCommentList', {
				type : context.state.classify,
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
    },
    // 删除评论
    [DEL_COMMENT] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/commentAction/delComment', {
                selectId : payload
            }, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                resolve(response);
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
				'Comment_ID' : tableData[i].Comment_ID,
				'Comment_Person_Name' : tableData[i].Comment_Person_Name,
				'Comment_Person_Email' : tableData[i].Comment_Person_Email,
				'Comment_Content' : tableData[i].Comment_Content,
				'Comment_Time' : tableData[i].Comment_Time,
				'Comment_ArticleID' : tableData[i].Comment_ArticleID,
				'Comment_ArticleTitle' : tableData[i].Comment_ArticleTitle,
				'Parent_CommentID' : tableData[i].Parent_CommentID,
				'Comment_Read' : tableData[i].Comment_Read
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

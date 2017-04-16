/**
 * 数据模块 - 删除外链
 */

import Vue from 'vue';

export const SET_NAME = 'data-link-del/SET_NAME';  // 名称
export const SET_SEQ = 'data-link-del/SET_SEQ';  // 排序字段
export const SET_DESC = 'data-link-del/SET_DESC';  // 排序规则

export const SET_TABLECOUNT = 'data-link-del/SET_TABLECOUNT';  // 当前表格数据总数
export const SET_TABLEPAGE = 'data-link-del/SET_TABLEPAGE';  // 当前表格当前页数
export const SET_TABLEDATA = 'data-link-del/SET_TABLEDATA';  // 当前表格当前数据

export const GET_TABLEDATACOUNT = 'data-link-del/GET_TABLEDATACOUNT';  // 根据根据父分类、子分类、时间区间获取表格数据总数--用来设置page
export const GET_TABLEDATA = 'data-link-del/GET_TABLEDATA';  // 根据根据子分类、时间区间获取表格数据--用来设置表格
export const DEL_LINK = 'data-link-del/DEL_LINK';  // 删除外链



const state  = {
    name : '',  // 名称
	seq : 'Link_ID',  // 排序字段
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
			console.info(context.state.classify);
			Vue.http.post(context.rootState.BASE_URL + '/linkAction/getLinkCount', {
				name : encodeURI(encodeURI(context.state.name)),
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
			Vue.http.post(context.rootState.BASE_URL + '/linkAction/getLinkList', {
				name : encodeURI(encodeURI(context.state.name)),
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
    // 删除外链
    [DEL_LINK] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/linkAction/delLink', {
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
	[SET_NAME](state , name){
		state.name = name;
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
				'Link_ID' : tableData[i].Link_ID,
				'Link_Name' : tableData[i].Link_Name,
				'Link_Url' : tableData[i].Link_Url
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

/**
 * 设置模块 - 数据备份
 */

import Vue from 'vue';

export const SET_NAME = 'cog-backup/SET_NAME';  // 名称

export const SET_TABLECOUNT = 'cog-backup/SET_TABLECOUNT';  // 当前表格数据总数
export const SET_TABLEPAGE = 'cog-backup/SET_TABLEPAGE';  // 当前表格当前页数
export const SET_TABLEDATA = 'cog-backup/SET_TABLEDATA';  // 当前表格当前数据

export const GET_TABLEDATACOUNT = 'cog-backup/GET_TABLEDATACOUNT';  // 根据根据父分类、子分类、时间区间获取表格数据总数--用来设置page
export const GET_TABLEDATA = 'cog-backup/GET_TABLEDATA';  // 根据根据子分类、时间区间获取表格数据--用来设置表格
export const DEL_BACKUP = 'cog-backup/DEL_BACKUP';  // 删除备份



const state  = {
    name : '',  // 名称
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
	// 根据根据子分类、时间区间获取表格数据--用来设置表格
	[GET_TABLEDATA] (context, payload) {
		return new Promise((resolve, reject) => {
			Vue.http.post(context.rootState.BASE_URL + '/backupAction/getBackupList', {
				name : encodeURI(encodeURI(context.state.name)),
				startDate : 0,
				endDate : 99999999,
				page : context.state.tablePage,
				size : 20
			}, {
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				},
				emulateJSON: true
			}).then(function(response) {
				// 初始化表格数据
				context.commit(SET_TABLECOUNT, response.data.count);
				context.commit(SET_TABLEDATA, response.data.data);
				resolve(response.data.data);
			}, function(response) {
				context.commit(SET_TABLEDATA, []);
				resolve(response.json());
			});
		})
	},
    // 删除备份
    [DEL_BACKUP] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/backupAction/delBackup', {
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
				'Backup_Name' : tableData[i].Backup_Name,
				'Backup_Size' : tableData[i].Backup_Size
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

/**
 * 分析模块 - 仪表盘模块
 */

import Vue from 'vue';

export const SET_OVERVIEWDATA = 'analyze-dashboard/SET_OVERVIEWDATA';  // 概览数据
export const SET_FSORTTYPE = 'analyze-dashboard/SET_FSORTTYPE';  // 父分类类型
export const SET_SUBSORTLIST = 'analyze-dashboard/SET_SUBSORTLIST';  // 子分类列表
export const SET_SELECTEDSUBSORT = 'analyze-dashboard/SET_SELECTEDSUBSORT';  // 当前子分类选中项
export const SET_TIMEINTERVAL = 'analyze-dashboard/SET_TIMEINTERVAL';  // 当前时间区间

const state  = {
	overviewData : {},  // 概览数据
    selectedFSortType : 'article',
    subSortList : [],  // 分类数据列表
    selectedSubSort : '-1',  // 默认选中全部
	timeInterval : ''  // 时间区间
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
	'articleTendency' : function (state) {
		if (state.overviewData.articleTendency) {
			return state.overviewData.articleTendency.split('')[0] !== '-';
		} else {
			return true;
		}
	},
	'noteTendency' : function (state) {
		if (state.overviewData.noteTendency) {
			return state.overviewData.noteTendency.split('')[0] !== '-';
		} else {
			return true;
		}
	},
	'commentTendency' : function (state) {
		if (state.overviewData.commentTendency) {
			return state.overviewData.commentTendency.split('')[0] !== '-';
		} else {
			return true;
		}
	},
	'bookTendency' : function (state) {
		if (state.overviewData.bookTendency) {
			return state.overviewData.bookTendency.split('')[0] !== '-';
		} else {
			return true;
		}
	}
};

// actions
const actions = {
	// 获取总览总数
	getAnalyzeCount ({ dispatch, commit, state, rootState }) {
		return new Promise((resolve, reject) => {
			Vue.http.post(rootState.BASE_URL + '/analyzeAction/getAnalyzeCount', {}, {
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				},
				emulateJSON: true
			}).then(function(response) {
				resolve(response.data);
			}, function(response) {
				console.error(response);
				resolve(response.json());
			});
		})
	},
    // 获取每个大分类下的小分类列表（例如：文章下的小分类）
    getSortByType ({ dispatch, commit, state, rootState }) {
        return new Promise((resolve, reject) => {
            Vue.http.post(rootState.BASE_URL + '/sortAction/byTypeGetSort', {
                // 参数部分
                'type' : state.selectedFSortType
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
                        tempSortList.push({value: '-1', label: '全部'});
                    } else {
                        tempSortList.push({value: data[i].Sort_ID, label: data[i].Sort_Name});
                    }
                }
                commit(SET_SUBSORTLIST, tempSortList);
                // 每一次获取子分类列表都要选中“全部”
                commit(SET_SELECTEDSUBSORT, '-1');
                resolve();
            }, function(response) {
                console.error(response);
                resolve(response.json());
            });
        })
    },
	// 根据父分类、子分类、时间区间获取数据
	getChartData ({ dispatch, commit, state, rootState }) {
		return new Promise((resolve, reject) => {
			console.info(state.selectedFSortType);
			console.info(state.selectedSubSort);
			console.info(state.timeInterval);
			// Vue.http.post(rootState.BASE_URL + '/analyzeAction/getAnalyzeCount', {}, {
			// 	headers: {
			// 		"X-Requested-With": "XMLHttpRequest"
			// 	},
			// 	emulateJSON: true
			// }).then(function(response) {
			// 	resolve(response.data);
			// }, function(response) {
			// 	console.error(response);
			// 	resolve(response.json());
			// });
		})
	},
};

// mutations
// action会发送请求到此，在此对state的值做设置处理
const mutations = {
	[SET_OVERVIEWDATA](state , overviewData){
		state.overviewData = overviewData;
	},
    [SET_FSORTTYPE](state , sortType){
	 	state.selectedFSortType = sortType;
    },
    [SET_SUBSORTLIST](state , sortList){
	    state.subSortList = sortList;
    },
    [SET_SELECTEDSUBSORT](state , selectedSort){
        state.selectedSubSort = selectedSort;
    },
	[SET_TIMEINTERVAL](state , timeInterval){
    	console.info(22222222);
    	console.info(timeInterval);
		state.timeInterval = timeInterval;
	},
};

export default {
	state,
	getters,
	actions,
	mutations
};

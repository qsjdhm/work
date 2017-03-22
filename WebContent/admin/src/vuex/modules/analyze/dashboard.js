/**
 * 分析模块 - 仪表盘模块
 */

import Vue from 'vue';

export const SET_OVERVIEWDATA = 'analyze-dashboard/SET_OVERVIEWDATA';  // 概览数据
export const SET_FSORTTYPE = 'analyze-dashboard/SET_FSORTTYPE';  // 父分类类型
export const SET_SUBSORTLIST = 'analyze-dashboard/SET_SUBSORTLIST';  // 子分类列表
export const SET_SELECTEDSUBSORT = 'analyze-dashboard/SET_SELECTEDSUBSORT';  // 当前子分类选中项
export const SET_TIMEINTERVAL = 'analyze-dashboard/SET_TIMEINTERVAL';  // 当前时间区间
export const SET_TABLECOUNT = 'analyze-dashboard/SET_TABLECOUNT';  // 当前表格数据总数
export const SET_TABLEPAGE = 'analyze-dashboard/SET_TABLEPAGE';  // 当前表格当前页数
export const SET_TABLEDATA = 'analyze-dashboard/SET_TABLEDATA';  // 当前表格当前数据

const state  = {
	overviewData : {},  // 概览数据
    selectedFSortType : 'article',
    subSortList : [],  // 分类数据列表
    selectedSubSort : '0',  // 默认选中全部
	timeInterval : '',  // 时间区间
    tableCount : 0,  // 表格数据总数
    tablePage : 1,  // 表格当前页
	tableData : [],  // 表格数据
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
				commit(SET_OVERVIEWDATA, response.data.countData);
				resolve(response.data);
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
                        tempSortList.push({value: '0', label: '全部'});
                    } else {
                        tempSortList.push({value: data[i].Sort_ID, label: data[i].Sort_Name});
                    }
                }
                commit(SET_SUBSORTLIST, tempSortList);
                // 每一次获取子分类列表都要选中“全部”
                commit(SET_SELECTEDSUBSORT, '0');
                resolve();
            }, function(response) {
            	// 请求错误情况下只显示全部，并且是选中状态
				commit(SET_SUBSORTLIST, [{value: '0', label: '全部'}]);
				commit(SET_SELECTEDSUBSORT, '0');
                resolve(response.json());
            });
        })
    },
	// 根据父分类、子分类、时间区间获取数据
	getChartData ({ dispatch, commit, state, rootState }) {
		// 根据父分类、子分类获取数据
		return new Promise((resolve, reject) => {
			Vue.http.post(rootState.BASE_URL + '/analyzeAction/getDataDistribution', {
				type: state.selectedFSortType
			}, {
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				},
				emulateJSON: true
			}).then(function(response) {
				console.info('图表数据：：：：：：：：：');
				console.info(response);
				resolve(response.data.data);
			}, function(response) {
				console.error(response);
				resolve(response.json());
			});
		});
	},
    // 根据根据父分类、子分类、时间区间获取表格数据总数--用来设置page
    getTableDataCount ({ dispatch, commit, state, rootState }) {
		// 根据父分类、子分类获取数据
		return new Promise((resolve, reject) => {
			let postData = {};
			let url = '';
			if (state.selectedFSortType === 'article') {
				postData = { sort : state.selectedSubSort };
				url = rootState.BASE_URL + '/articleAction/getArticleCount';
			} else if (state.selectedFSortType === 'note') {
				postData = { sort : state.selectedSubSort };
				url = rootState.BASE_URL + '/noteAction/getNoteCount';
			} else if (state.selectedFSortType === 'comment') {
				url = rootState.BASE_URL + '/commentAction/getCommentCount';
			} else if (state.selectedFSortType === 'book') {
				postData = { sort : state.selectedSubSort };
				url = rootState.BASE_URL + '/bookAction/getBookCount';
			}

			Vue.http.post(url, postData, {
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				},
				emulateJSON: true
			}).then(function(response) {
				// 初始化表格总数和当前页索引
				commit(SET_TABLECOUNT, response.data.data);
				commit(SET_TABLEPAGE, 1);
				resolve(response.data.data);
			}, function(response) {
				console.error(response);
				resolve(response.json());
			});
		});
    },
    // 根据根据父分类、子分类、时间区间获取表格数据--用来设置表格
    getTableData ({ dispatch, commit, state, rootState }) {
        return new Promise((resolve, reject) => {
			let postData = {};
			let url = '';
			if (state.selectedFSortType === 'article') {
				postData = {
					sort : state.selectedSubSort,
					page : state.tablePage,
					size : 20
				};
				url = rootState.BASE_URL + '/articleAction/getArticleList';
			} else if (state.selectedFSortType === 'note') {
				postData = {
					sort : state.selectedSubSort,
					page : state.tablePage,
					size : 20
				};
				url = rootState.BASE_URL + '/noteAction/getNoteList';
			} else if (state.selectedFSortType === 'comment') {
				postData = {
					page : state.tablePage,
					size : 20
				};
				url = rootState.BASE_URL + '/commentAction/getCommentList';
			} else if (state.selectedFSortType === 'book') {
				postData = {
					sort : state.selectedSubSort,
					page : state.tablePage,
					size : 20
				};
				url = rootState.BASE_URL + '/bookAction/getBookList';
			}

			Vue.http.post(url, postData, {
				headers: {
					"X-Requested-With": "XMLHttpRequest"
				},
				emulateJSON: true
			}).then(function(response) {
				// 初始化表格数据
				commit(SET_TABLEDATA, response.data.data);
				resolve(response.data.data);
			}, function(response) {
				commit(SET_TABLEDATA, []);
				resolve(response.json());
			});
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
		state.timeInterval = timeInterval;
	},
    [SET_TABLECOUNT](state , tableCount){
        state.tableCount = tableCount;
    },
    [SET_TABLEPAGE](state , tablePage){
        state.tablePage = tablePage;
    },
	[SET_TABLEDATA](state , tableData){
    	var tempData = [];
    	// 根据不同的父类型，要处理下数据
		for (let i = 0, len = tableData.length; i < len; i++) {
			if (state.selectedFSortType === 'article' || state.selectedFSortType === 'note') {
				tempData.push({
					'id' : tableData[i].Article_ID,
					'name' : tableData[i].Article_Title
				});
			} else if (state.selectedFSortType === 'comment') {
				tempData.push({
					'id' : tableData[i].Comment_ID,
					'name' : tableData[i].Comment_ArticleTitle
				});
			} else if (state.selectedFSortType === 'book') {
				tempData.push({
					'id' : tableData[i].Book_ID,
					'name' : tableData[i].Book_Name
				});
			}
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

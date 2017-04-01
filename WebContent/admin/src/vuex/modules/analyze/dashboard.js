/**
 * 分析模块 - 仪表盘模块
 */

import Vue from 'vue';

// mutation的标志
export const SET_OVERVIEWDATA = 'analyze-dashboard/SET_OVERVIEWDATA';  // 概览数据
export const SET_FSORTTYPE = 'analyze-dashboard/SET_FSORTTYPE';  // 父分类类型
export const SET_SUBSORTLIST = 'analyze-dashboard/SET_SUBSORTLIST';  // 子分类列表
export const SET_SELECTEDSUBSORT = 'analyze-dashboard/SET_SELECTEDSUBSORT';  // 当前子分类选中项
export const SET_STARTTIME = 'analyze-dashboard/SET_STARTTIME';  // 起始日期
export const SET_ENDTIME = 'analyze-dashboard/SET_ENDTIME';  // 结束日期
export const SET_CHARTDATA = 'analyze-dashboard/SET_CHARTDATA';  // 当前图表数据总数
export const SET_TABLECOUNT = 'analyze-dashboard/SET_TABLECOUNT';  // 当前表格数据总数
export const SET_TABLEPAGE = 'analyze-dashboard/SET_TABLEPAGE';  // 当前表格当前页数
export const SET_TABLEDATA = 'analyze-dashboard/SET_TABLEDATA';  // 当前表格当前数据

// action的标志
export const GET_ANALYZECOUNT = 'analyze-dashboard/GET_ANALYZECOUNT';  // 获取总览总数
export const GET_SORTBYTYPE = 'analyze-dashboard/GET_SORTBYTYPE';  // 获取每个大分类下的小分类列表（例如：文章下的小分类）
export const GET_CHARTDATA = 'analyze-dashboard/GET_CHARTDATA';  // 根据父分类、子分类、时间区间获取数据
export const GET_TABLEDATACOUNT = 'analyze-dashboard/GET_TABLEDATACOUNT';  // 根据根据父分类、子分类、时间区间获取表格数据总数--用来设置page
export const GET_TABLEDATA = 'analyze-dashboard/GET_TABLEDATA';  // 根据根据父分类、子分类、时间区间获取表格数据--用来设置表格

const state  = {
	overviewData : {},  // 概览数据
    selectedFSortType : 'article',
    subSortList : [],  // 分类数据列表
    selectedSubSort : '0',  // 默认选中全部
	startTime : '',  // 起始日期
	endTime : '',  // 结束日期
    chartData : {},  // 图表数据
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
    [GET_ANALYZECOUNT] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/analyzeAction/getAnalyzeCount', {}, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                context.commit(SET_OVERVIEWDATA, response.data.countData);
                resolve(response.data);
            });
        })
    },
    // 获取每个大分类下的小分类列表（例如：文章下的小分类）
    [GET_SORTBYTYPE] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/sortAction/byTypeGetSort', {
                // 参数部分
                'type' : context.state.selectedFSortType
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
                context.commit(SET_SUBSORTLIST, tempSortList);
                // 每一次获取子分类列表都要选中“全部”
                context.commit(SET_SELECTEDSUBSORT, '0');
                resolve();
            }, function(response) {
                // 请求错误情况下只显示全部，并且是选中状态
                context.commit(SET_SUBSORTLIST, [{value: '0', label: '全部'}]);
                context.commit(SET_SELECTEDSUBSORT, '0');
                resolve(response.json());
            });
        })
    },
    // 根据父分类、子分类、时间区间获取数据
    [GET_CHARTDATA] (context, payload) {
        return new Promise((resolve, reject) => {
            let postData = {};
            if (context.state.selectedFSortType === 'article') {
                postData = {
                    type : context.state.selectedFSortType,
                    sort : context.state.selectedSubSort,
                    start: context.state.startTime,
                    end  : context.state.endTime,
                };
            } else if (context.state.selectedFSortType === 'note') {
                postData = {
                    type : context.state.selectedFSortType,
                    sort : context.state.selectedSubSort,
                    start: context.state.startTime,
                    end  : context.state.endTime,
                };
            } else if (context.state.selectedFSortType === 'comment') {
                postData = {
                    type : context.state.selectedFSortType,
                    start: context.state.startTime,
                    end  : context.state.endTime,
                };
            } else if (context.state.selectedFSortType === 'book') {
                postData = {
                    type : context.state.selectedFSortType,
                    sort : context.state.selectedSubSort
                };
            }
            Vue.http.post(context.rootState.BASE_URL + '/analyzeAction/getDataDistribution', postData, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                emulateJSON: true
            }).then(function(response) {
                context.commit(SET_CHARTDATA, response.data.data);
                resolve(response.data);
            }, function(response) {
                console.error(response);
                resolve(response.json());
            });
        });
    },
    // 根据根据父分类、子分类、时间区间获取表格数据总数--用来设置page
    [GET_TABLEDATACOUNT] (context, payload) {
        return new Promise((resolve, reject) => {
            let postData = {};
            let url = '';
            if (context.state.selectedFSortType === 'article') {
                postData = {
                    sort : context.state.selectedSubSort,
                    start: context.state.startTime,
                    end  : context.state.endTime,
                };
                url = context.rootState.BASE_URL + '/articleAction/getArticleCount';
            } else if (context.state.selectedFSortType === 'note') {
                postData = {
                    sort : context.state.selectedSubSort,
                    start: context.state.startTime,
                    end  : context.state.endTime,
                };
                url = context.rootState.BASE_URL + '/noteAction/getNoteCount';
            } else if (context.state.selectedFSortType === 'comment') {
                postData = {
                    start: context.state.startTime,
                    end  : context.state.endTime,
                };
                url = context.rootState.BASE_URL + '/commentAction/getCommentCount';
            } else if (context.state.selectedFSortType === 'book') {
                postData = {
                    sort : context.state.selectedSubSort
                };
                url = context.rootState.BASE_URL + '/bookAction/getBookCount';
            }

            Vue.http.post(url, postData, {
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
    // 根据根据父分类、子分类、时间区间获取表格数据--用来设置表格
    [GET_TABLEDATA] (context, payload) {
        return new Promise((resolve, reject) => {
            let postData = {};
            let url = '';
            if (context.state.selectedFSortType === 'article') {
                postData = {
                    sort : context.state.selectedSubSort,
                    start: context.state.startTime,
                    end  : context.state.endTime,
                    page : context.state.tablePage,
                    size : 20
                };
                url = context.rootState.BASE_URL + '/articleAction/getArticleList';
            } else if (context.state.selectedFSortType === 'note') {
                postData = {
                    sort : context.state.selectedSubSort,
                    start: context.state.startTime,
                    end  : context.state.endTime,
                    page : context.state.tablePage,
                    size : 20
                };
                url = context.rootState.BASE_URL + '/noteAction/getNoteList';
            } else if (context.state.selectedFSortType === 'comment') {
                postData = {
                    start: context.state.startTime,
                    end  : context.state.endTime,
                    page : context.state.tablePage,
                    size : 20
                };
                url = context.rootState.BASE_URL + '/commentAction/getCommentList';
            } else if (context.state.selectedFSortType === 'book') {
                postData = {
                    sort : context.state.selectedSubSort,
                    page : context.state.tablePage,
                    size : 20
                };
                url = context.rootState.BASE_URL + '/bookAction/getBookList';
            }

            Vue.http.post(url, postData, {
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
	[SET_STARTTIME](state , startTime){
		state.startTime = startTime;
	},
	[SET_ENDTIME](state , endTime){
		state.endTime = endTime;
	},
    [SET_CHARTDATA](state , chartData){
        var returnData = {};
        if (state.selectedFSortType === 'article' || state.selectedFSortType === 'note' || state.selectedFSortType === 'comment') {
            let xAxis = [];
            let dataValue = [];
            for (let i = 0, len = chartData.length; i < len; i++) {
                xAxis.push(chartData[i].date);  // 刻度
                dataValue.push(chartData[i].count);  // 刻度值
            }
            returnData['legend'] = ['本月总数'];
            returnData['xAxis'] = xAxis;
            returnData['data'] = [{
                name : '本月总数',
                type : 'line',
                areaStyle: {
                    normal: {
                        color:'#E0F1FC'
                    }
                },
                itemStyle : {
                    normal : {
                        color: '#84b8f1',
                    }
                },
                data : dataValue
            }];
        } else if (state.selectedFSortType === 'book') {
            let xAxis = [];
            let dataValue = [];
            for (let i = 0, len = chartData.length; i < len; i++) {
                xAxis.push(chartData[i].date);  // 刻度
                dataValue.push(chartData[i].count);  // 刻度值
            }
            returnData['legend'] = ['本月总数'];
            returnData['xAxis'] = xAxis;
            returnData['data'] = [{
                name : '本月总数',
                type : 'bar',
                areaStyle: {
                    normal: {
                        color:'#E0F1FC'
                    }
                },
                itemStyle : {
                    normal : {
                        color: '#84b8f1',
                    }
                },
                data : dataValue
            }];
        }
        state.chartData = returnData;
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
			if (state.selectedFSortType === 'article' || state.selectedFSortType === 'note') {
				tempData.push({
					'id' : tableData[i].Article_ID,
					'name' : tableData[i].Article_Title
				});
			} else if (state.selectedFSortType === 'comment') {
				tempData.push({
					'id' : tableData[i].Comment_ID,
					'name' : tableData[i].Comment_Content
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

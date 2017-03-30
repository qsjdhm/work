/**
 * 分析模块 - 仪表盘模块
 */

import Vue from 'vue';

export const SET_SUBSORTLIST = 'analyze-article-pv/SET_SUBSORTLIST';  // 子分类列表
export const SET_SELECTEDSUBSORT = 'analyze-article-pv/SET_SELECTEDSUBSORT';  // 当前子分类选中项
export const SET_STARTTIME = 'analyze-article-pv/SET_STARTTIME';  // 起始日期
export const SET_ENDTIME = 'analyze-article-pv/SET_ENDTIME';  // 结束日期
export const SET_CHARTDATA = 'analyze-article-pv/SET_CHARTDATA';  // 当前图表数据总数
export const SET_TABLEDATA = 'analyze-article-pv/SET_TABLEDATA';  // 当前表格当前数据


export const GET_SORTBYTYPE = 'analyze-article-pv/GET_SORTBYTYPE';  // 获取每个大分类下的小分类列表（例如：文章下的小分类）
export const GET_CHARTDATA = 'analyze-article-pv/GET_CHARTDATA';  // 根据父分类、子分类、时间区间获取数据
export const GET_TABLEDATA = 'analyze-article-pv/GET_TABLEDATA';  // 根据根据子分类、时间区间获取表格数据--用来设置表格


const state  = {
    subSortList : [],  // 分类数据列表
    selectedSubSort : '0',  // 默认选中全部
	startTime : '',  // 起始日期
	endTime : '',  // 结束日期
    chartData : {},  // 图表数据
    tableData : [],  // 表格数据
};

// getters
// 只能获取state中的值，并且可以进行数据处理，但是不建议，因为view中需要获取最初始的state的状态
const getters = {
};

// actions
const actions = {
    // 获取每个大分类下的小分类列表（例如：文章下的小分类）
    [GET_SORTBYTYPE] (context, payload) {
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
        // 根据子分类获取数据
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/analyzeAction/getDataDistributionByRead', {
                type : 'article',
                sort : context.state.selectedSubSort,
                start: context.state.startTime,
                end  : context.state.endTime,
            }, {
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
    // 根据根据子分类、时间区间获取表格数据--用来设置表格
    [GET_TABLEDATA] (context, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post(context.rootState.BASE_URL + '/articleAction/getHeatArticleList', {
                sort : context.state.selectedSubSort,
                start: context.state.startTime,
                end  : context.state.endTime,
                page : 1,
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
        let xAxis = [];
        let dataValue = [];
        for (let i = 0, len = chartData.length; i < len; i++) {
            xAxis.push(chartData[i].date);  // 刻度
            dataValue.push(chartData[i].sum);  // 刻度值
        }
        returnData['legend'] = ['本月热度'];
        returnData['xAxis'] = xAxis;
        returnData['data'] = [{
            name : '本月热度',
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
        },
        {
            name : '本月总数',
            type : 'bar',
            itemStyle : {
                normal : {
                    color: '#25d6a7',
                }
            },
            barWidth: 10,
            data : dataValue
        }];
        state.chartData = returnData;
    },
    [SET_TABLEDATA](state , tableData){
        let tempData = [];
        // 根据不同的父类型，要处理下数据
        for (let i = 0, len = tableData.length; i < len; i++) {
            tempData.push({
                'id' : tableData[i].Article_ID,
                'name' : tableData[i].Article_Title,
                'heat' : tableData[i].Read_Num
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

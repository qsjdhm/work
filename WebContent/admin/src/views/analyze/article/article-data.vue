<template>
    <div class="analyze-article-data-page">
        <div class="header">
            <el-row :gutter="20">
                <el-col class="header-title" :span="24">
                    整体趋势
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col class="header-tip" :span="6">
                    数据总量合计<span>{{sum}}</span>
                    月均量<span>{{monthly}}</span>
                </el-col>
                <el-col class="header-filter" :span="18">
                    <el-select class="filter-sort" v-model="subSortValue" placeholder="请选择">
                        <el-option
                            v-for="(item, key) in subSortList"
                            :label="item.label"
                            :value="item.value"
                            :key="key">
                        </el-option>
                    </el-select>
                    <el-date-picker
                        class="filter-time"
                        v-model="startTimeValue"
                        type="month"
                        placeholder="起始日期">
                    </el-date-picker>
                    <span> - </span>
                    <el-date-picker
                        class="filter-time"
                        v-model="endTimeValue"
                        type="month"
                        placeholder="至今">
                    </el-date-picker>
                </el-col>
            </el-row>
        </div>
        <div class="container">
            <el-row class="container-data" :gutter="20">
                <el-col id="chart_pack" class="container-chart" :span="12">
                    <div id="main" :style="{ width: '100%', height: tableHeight + 150 + 'px' }"></div>
                </el-col>
                <el-col class="container-table" :span="12">
                    <div class="table-data">
                        <div class="table-data">
                            <el-table
                                :data="tableData"
                                :height="tableHeight+90"
                                border
                                style="width: 100%">
                                <el-table-column
                                    prop="id"
                                    label="ID"
                                    width="65">
                                </el-table-column>
                                <el-table-column
                                    prop="name"
                                    label="名称">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="table-page">
                            <el-pagination
                                @current-change="tablePageChange"
                                :current-page="tablePage"
                                :page-size="20"
                                layout="total, prev, pager, next"
                                :total="tableCount">
                            </el-pagination>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>

</template>

<script type="text/ecmascript-6">
    // 引入 ECharts 主模块
    var echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/line');
    require('echarts/lib/chart/bar');
    require('echarts/lib/component/toolbox');
    require('echarts/lib/component/dataZoom');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/grid');
    require('echarts/lib/component/legend');

    import '../../../css/analyze/article/article-data.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_SUBSORTLIST,
        SET_SELECTEDSUBSORT,
        SET_STARTTIME,
        SET_ENDTIME,
        SET_TABLEPAGE,

        GET_SORTBYTYPE,
        GET_CHARTDATA,
        GET_TABLEDATACOUNT,
        GET_TABLEDATA
    } from '../../../vuex/modules/analyze/article/article-data';

    export default {
        data: function () {
            return {
                myChart : null,  // 图表组件对象
                tableHeight : 0, // table的高度
                sum : 0,         // 总计
                monthly : 0,     // 月均
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                subSortList: state => state.analyzeArticleData.subSortList,
                selectedSubSort: state => state.analyzeArticleData.selectedSubSort,
                startTime: state => state.analyzeArticleData.startTime,
                endTime: state => state.analyzeArticleData.endTime,
                chartData: state => state.analyzeArticleData.chartData,
                tableCount: state => state.analyzeArticleData.tableCount,
                tablePage: state => state.analyzeArticleData.tablePage,
                tableData: state => state.analyzeArticleData.tableData,
            }),

            //sortClick
            // 子分类切换事件
            subSortValue: {
                get: function () { return this.selectedSubSort; },
                set: function (newSort) {
                    const self = this;
                    this.$store.commit(SET_SELECTEDSUBSORT, newSort);
                    this.$store.commit(SET_STARTTIME, '');
                    this.$store.commit(SET_ENDTIME, '');

                    self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                        // 获取数据区间个数
                        return self.$store.dispatch(GET_CHARTDATA);
                    }).then(function (response) {
                        self.sum = response.total;
                        self.monthly = response.monthly;
                        self.initChart();
                        self.$store.dispatch(GET_TABLEDATA);
                    });
                }
            },
            // 时间区间切换事件
            startTimeValue: {
                get: function () { return this.startTime; },
                set: function (newTime) {
                    const self = this;
                    if (newTime === '') {
                        self.$store.commit(SET_STARTTIME, '');
                    } else {
                        let year = newTime.getFullYear();
                        let month = newTime.getMonth()+1;
                        if (month < 10) {
                            month = '0'+month;
                        }
                        self.$store.commit(SET_STARTTIME, year+'-'+month);
                    }

                    // 获取数据区间个数
                    self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                        return self.$store.dispatch(GET_CHARTDATA);
                    }).then(function (response) {
                        self.sum = response.total;
                        self.monthly = response.monthly;
                        self.initChart();
                        self.$store.dispatch(GET_TABLEDATA);
                    });
                }
            },
            endTimeValue: {
                get: function () { return this.endTime; },
                set: function (newTime) {
                    const self = this;
                    if (newTime === '') {
                        self.$store.commit(SET_ENDTIME, '');
                    } else {
                        let year = newTime.getFullYear();
                        let month = newTime.getMonth() + 1;
                        if (month < 10) {
                            month = '0' + month;
                        }
                        self.$store.commit(SET_ENDTIME, year + '-' + month);
                    }

                    // 获取数据区间个数
                    self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                        return self.$store.dispatch(GET_CHARTDATA);
                    }).then(function (response) {
                        self.sum = response.total;
                        self.monthly = response.monthly;
                        self.initChart();
                        self.$store.dispatch(GET_TABLEDATA);
                    });
                }
            }
        },
        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setChildMenuShow',
                'setActiveTopMenu',
                'setActiveChildMenu'
            ]),

            // 翻页事件
            tablePageChange(val) {
                this.$store.commit(SET_TABLEPAGE, val);
                // 重新获取当前页的table表数据
                this.$store.dispatch(GET_TABLEDATA);
            },
            // 初始化图表
            initChart() {
                let self = this;
                // 基于准备好的dom，初始化echarts实例
                self.myChart = echarts.init(document.getElementById('main'));

                // 指定图表的配置项和数据
                let option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    grid: {
                        height: self.tableHeight + 70,
                        top: 10,
                        left: '3%',
                        right: '4%',
                        containLabel: true
                    },
                    dataZoom: [
                        {
                            start: 0,
                            end: 80,
                        }
                    ],
                    xAxis: {
                        nameLocation: 'start',
                        data: self.chartData.xAxis,
                        boundaryGap: false,
                        splitLine: {  // 网格
                            show: true,
                            lineStyle: {
                                // 使用深浅的间隔色
                                color: ['#ddd']
                            }
                        },
                        axisTick: {
                            alignWithLabel: false
                        },
                        axisLabel:{  // 刻度倾斜
                            interval: 0,
                            rotate: 45,//倾斜度 -90 至 90 默认为0
                            textStyle:{
                                color: "#666"
                            }
                        },
                    },
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series: self.chartData.data
                };
                // 使用刚指定的配置项和数据显示图表。
                self.myChart.setOption(option);
            }
        },
        created: function () {
            // 打开此view应该设置顶部菜单和子级菜单的选中状态
            let pId = this.$route.meta.pId;
            let path = this.$route.path;
            const self = this;
            // 如果路由中当前页面的state中的选中顶级菜单不同需要设置顶级菜单和与之对应的子菜单
            if (this.topActiveMenu !== pId) {
                this.setChildMenuShow(false).then(function () {
                    return self.setActiveTopMenu(pId);
                }).then(function () {
                    // 通过v-if，使每次切换顶级菜单时，让浏览器重新渲染子菜单组件，达到切换顶级菜单后默认选中第一个子菜单
                    return self.setChildMenuShow(true);
                }).then(function () {
                    self.setActiveChildMenu(path);
                });
            } else {
                // 否则只需要设置子菜单选中项
                this.setActiveChildMenu(path);
            }
        },
        // 此声明周期挂载dom已经开始，适用于处理dom操作
        mounted: function () {
            const self = this;
            // 设置table高度
            this.tableHeight = document.getElementById("frameworkContainer").offsetHeight - 260;
            // 获取分类列表
            self.$store.dispatch(GET_SORTBYTYPE).then(function (response) {
                // 获取数据总个数
                return self.$store.dispatch(GET_TABLEDATACOUNT);
            }).then(function (response) {
                // 获取数据区间个数
                return self.$store.dispatch(GET_CHARTDATA);
            }).then(function (response) {
                self.sum = response.total;
                self.monthly = response.monthly;
                self.initChart();
                self.$store.dispatch(GET_TABLEDATA);
            });
        },
    }
</script>

<style scoped>

</style>

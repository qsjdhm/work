<template>
    <div class="analyze-article-pv-page">
        <div class="header">
            <el-row :gutter="20">
                <el-col class="header-tip" :span="24">
                    整体趋势
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col class="header-sort" :span="10">
                    <div class="sort-item"
                         :class="[selectedSubSort==item.value ? 'sort-item-active' : '']"
                         v-for="(item, key) in subSortList"
                         :index="item.value"
                         :key="key"
                         @click="sortClick(item.value)" title="点击可查看此分类下数据分析"
                    >
                         {{item.label}}
                    </div>
                </el-col>
                <el-col class="header-filter" :span="14">
                    <el-date-picker
                        class="header-time"
                        v-model="startTimeValue"
                        type="month"
                        placeholder="起始日期">
                    </el-date-picker>
                    <span> - </span>
                    <el-date-picker
                        class="header-time"
                        v-model="endTimeValue"
                        type="month"
                        placeholder="至今">
                    </el-date-picker>
                </el-col>
            </el-row>
        </div>
        <div class="container">
            <el-row :gutter="20">
                <el-col class="container-tip" :span="24">
                    阅读总量合计<span>{{sum}}</span>
                    月均热度<span>{{monthly}}</span>
                </el-col>
            </el-row>
            <el-row class="container-data" :gutter="20">
                <el-col id="chart_pack" class="container-chart" :span="24">
                    <div id="main" :style="{ width: '100%', height: tableHeight + 100 + 'px' }"></div>
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
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/grid');
    require('echarts/lib/component/legend');


    import '../../../css/analyze/article/article-pv.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    // 引入框架派发器
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

        GET_SORTBYTYPE,
        GET_CHARTDATA,
        GET_TABLEDATACOUNT,
        GET_TABLEDATA
    } from '../../../vuex/modules/analyze/article/article-pv';

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

                subSortList: state => state.analyzeArticlePV.subSortList,
                selectedSubSort: state => state.analyzeArticlePV.selectedSubSort,
                startTime: state => state.analyzeArticlePV.startTime,
                endTime: state => state.analyzeArticlePV.endTime,
                chartData: state => state.analyzeArticlePV.chartData,
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
                    this.getTableDataCount().then(function (response) {
                        return self.getTableData();
                    }).then(function (response) {
                        // 获取数据区间个数
                        return self.getChartData();
                    }).then(function (response) {
                        self.monthly = response.monthly;
                        self.sum = response.total;
                        self.initChart();
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

                    self.$store.dispatch(GET_CHARTDATA).then(function (response) {
                        self.sum = response.total;
                        self.monthly = response.monthly;
                        self.initChart();
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

                    self.$store.dispatch(GET_CHARTDATA).then(function (response) {
                        self.sum = response.total;
                        self.monthly = response.monthly;
                        self.initChart();
                    });
                }
            }
        },
        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setActiveTopMenu',
                'setActiveChildMenu',

                'getSortByType',
                'getChartData',
            ]),
            // 分类点击事件
            sortClick(newSort) {
                const self = this;
                this.$store.commit(SET_SELECTEDSUBSORT, newSort);
                this.$store.commit(SET_STARTTIME, '');
                this.$store.commit(SET_ENDTIME, '');
                this.$store.dispatch(GET_CHARTDATA).then(function (response) {
                    self.sum = response.total;
                    self.monthly = response.monthly;
                    self.initChart();
                });
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
                        height: self.tableHeight + 50,
                        top: 10,
                        left: '3%',
                        right: '4%',
                        containLabel: true
                    },
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
            if (this.topActiveMenu !== pId) {
                this.setActiveTopMenu(pId).then(function () {
                    self.setActiveChildMenu(path);
                });
            }
        },
        // 此声明周期挂载dom已经开始，适用于处理dom操作
        mounted: function () {
            const self = this;
            // 设置table高度
            this.tableHeight = document.getElementById("frameworkContainer").offsetHeight - 260;
            // 获取分类列表
            self.$store.dispatch(GET_SORTBYTYPE).then(function (response) {
                // 获取数据区间个数
                return self.$store.dispatch(GET_CHARTDATA);
            }).then(function (response) {
                self.sum = response.total;
                self.monthly = response.monthly;
                self.initChart();
            });
        },
    }
</script>

<style scoped>

</style>

<template>
	<div class="analyze-dashboard-page">
		<div class="dashboard">
			<div class="dashboard-header">
				系统数据概览
			</div>
			<div class="dashboard-container">
				<el-row :gutter="20">
					<el-col class="dashboard-item" :span="5">
                        <div @click="dashboardClick('article')" title="点击可查看此模块下数据分析">
                            {{overviewData.articleCount | formatNumber}}
                            <span class="tendency-arrows">
                                <i class="fa"
                                   :class="{'fa-long-arrow-down': !articleTendency, 'fa-long-arrow-up': articleTendency}">
                                </i>
                                {{overviewData.articleTendency}}
                            </span>
                            <div class="dashboard-count-desc"
								 :class="[selectedFSortType=='article' ? 'dashboard-count-desc-active' : '']">文章总数(比上月趋势)</div>
                        </div>
					</el-col>
                    <el-col class="dashboard-item" :span="5">
                        <div @click="dashboardClick('note')" title="点击可查看此模块下数据分析">
                            {{overviewData.noteCount | formatNumber}}
                            <span class="tendency-arrows">
                                <i class="fa"
                                   :class="{'fa-long-arrow-down': !noteTendency, 'fa-long-arrow-up': noteTendency}">
                                </i>
                                {{overviewData.noteTendency}}
                            </span>
                            <div class="dashboard-count-desc"
								 :class="[selectedFSortType=='note' ? 'dashboard-count-desc-active' : '']">笔记总数(比上月趋势)</div>
                        </div>
					</el-col>
                    <el-col class="dashboard-item" :span="5">
                        <div @click="dashboardClick('comment')" title="点击可查看此模块下数据分析">
                            {{overviewData.commentCount | formatNumber}}
                            <span class="tendency-arrows">
                                <i class="fa"
                                   :class="{'fa-long-arrow-down': !commentTendency, 'fa-long-arrow-up': commentTendency}">
                                </i>
                                {{overviewData.commentTendency}}
                            </span>
                            <div class="dashboard-count-desc"
								 :class="[selectedFSortType=='comment' ? 'dashboard-count-desc-active' : '']">用户评论数(比上月趋势)</div>
                        </div>
					</el-col>
                    <el-col class="dashboard-item" :span="5">
                        <div @click="dashboardClick('book')" title="点击可查看此模块下数据分析">
                            {{overviewData.bookCount | formatNumber}}
                            <span class="tendency-arrows">
                                <i class="fa"
                                   :class="{'fa-long-arrow-down': !bookTendency, 'fa-long-arrow-up': bookTendency}">
                                </i>
                                {{overviewData.bookTendency}}
                            </span>
                            <div class="dashboard-count-desc"
								 :class="[selectedFSortType=='book' ? 'dashboard-count-desc-active' : '']">上传图书量(比上月趋势)</div>
                        </div>
					</el-col>
					<el-col :span="4"></el-col>
				</el-row>
			</div>
		</div>

		<div class="details">
			<div class="details-header">
				<el-row :gutter="20">
					<el-col v-if="selectedFSortType=='article'" class="header-desc" :span="4">文章数据分布</el-col>
					<el-col v-if="selectedFSortType=='note'" class="header-desc" :span="4">笔记数据分布</el-col>
					<el-col v-if="selectedFSortType=='comment'" class="header-desc" :span="4">评论数据分布</el-col>
					<el-col v-if="selectedFSortType=='book'" class="header-desc" :span="4">图书数据分布</el-col>
					<el-col class="header-details" :span="20">
						<router-link to="/home/data-article-edit">查看详情</router-link>
						<i class="fa fa-download"></i>
					</el-col>
				</el-row>
			</div>
			<div class="details-container">
				<el-row :gutter="20">
					<el-col class="container-tip" :span="6">
						合计<span>{{sum}}</span>
						月均<span>{{monthly}}</span>
					</el-col>
					<el-col class="container-filter" :span="18">
						<el-select v-if="selectedFSortType!=='comment'" class="filter-sort" v-model="subSortValue" placeholder="请选择">
						    <el-option
                                v-for="(item, key) in subSortList"
                                :label="item.label"
                                :value="item.value"
                                :key="key">
                            </el-option>
                        </el-select>
                        <el-date-picker
							v-if="selectedFSortType!=='book'"
                            class="filter-time"
                            v-model="startTimeValue"
                            type="month"
                            placeholder="起始日期">
                        </el-date-picker>
						<span v-if="selectedFSortType!=='book'"> - </span>
						<el-date-picker
								v-if="selectedFSortType!=='book'"
								class="filter-time"
								v-model="endTimeValue"
								type="month"
								placeholder="至今">
						</el-date-picker>
					</el-col>
				</el-row>
                <el-row class="container-data" :gutter="20">
                    <el-col id="chart_pack" class="container-chart" :span="14">
						<div id="main" :style="{ width: '100%', height: tableHeight + 50 + 'px' }"></div>
                    </el-col>
					<!--<el-col class="container-table" :span="1">
					</el-col>-->
                    <el-col class="container-table" :span="10">
                        <div class="table-data">
							<el-table
									:data="tableData"
									:height="tableHeight"
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
                    </el-col>
                </el-row>
			</div>
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


	import '../../css/analyze/dashboard.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    // 引入框架派发器
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../vuex/modules/fremework';
    // 引入此页面派发器
    import {
		SET_OVERVIEWDATA,
        SET_FSORTTYPE,
        SET_SUBSORTLIST,
		SET_SELECTEDSUBSORT,
		SET_STARTTIME,
		SET_ENDTIME,
        SET_TABLEPAGE,
		SET_TABLEDATA,

        GET_ANALYZECOUNT,
        GET_SORTBYTYPE,
        GET_CHARTDATA,
        GET_TABLEDATACOUNT,
        GET_TABLEDATA
    } from '../../vuex/modules/analyze/dashboard';

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

				overviewData: state => state.analyzeDashboard.overviewData,
                selectedFSortType: state => state.analyzeDashboard.selectedFSortType,
                subSortList: state => state.analyzeDashboard.subSortList,
                selectedSubSort: state => state.analyzeDashboard.selectedSubSort,
				startTime: state => state.analyzeDashboard.startTime,
				endTime: state => state.analyzeDashboard.endTime,
                chartData: state => state.analyzeDashboard.chartData,
                tableCount: state => state.analyzeDashboard.tableCount,
                tablePage: state => state.analyzeDashboard.tablePage,
				tableData: state => state.analyzeDashboard.tableData,
            }),
			...mapGetters([
				'articleTendency',
				'noteTendency',
				'commentTendency',
				'bookTendency'
			]),
			// 子分类切换事件
			subSortValue: {
				get: function () { return this.selectedSubSort; },
				set: function (newSort) {
					const self = this;
					this.$store.commit(SET_SELECTEDSUBSORT, newSort);
					this.$store.commit(SET_STARTTIME, '');
					this.$store.commit(SET_ENDTIME, '');
                    this.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                        return self.$store.dispatch(GET_TABLEDATA);
                    }).then(function (response) {
                        // 获取数据区间个数
                        return self.$store.dispatch(GET_CHARTDATA);
                    }).then(function (response) {
                        self.sum = response.total;
                        self.monthly = response.monthly;
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

                    this.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                        return self.$store.dispatch(GET_TABLEDATA);
                    }).then(function (response) {
                        // 获取数据区间个数
                        return self.$store.dispatch(GET_CHARTDATA);
                    }).then(function (response) {
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

                    this.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                        return self.$store.dispatch(GET_TABLEDATA);
                    }).then(function (response) {
                        // 获取数据区间个数
                        return self.$store.dispatch(GET_CHARTDATA);
                    }).then(function (response) {
                        self.sum = response.total;
                        self.monthly = response.monthly;
                        self.initChart();
                    });
				}
			}
        },
		filters:{
    		// 格式化数据
			formatNumber : function(num) {
				var result = [ ], counter = 0;
				num = (num || 0).toString().split('');
				for (var i = num.length - 1; i >= 0; i--) {
					counter++;
					result.unshift(num[i]);
					if (!(counter % 3) && i != 0) { result.unshift(','); }
				}
				return result.join('');
			}
		},
        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setChildMenuShow',
                'setActiveTopMenu',
                'setActiveChildMenu',
            ]),
			// 概览项点击事件
            dashboardClick : function (type) {
            	const self = this;
            	// 父类变了再重新获取
            	if (type !== this.selectedFSortType) {
					this.$store.commit(SET_FSORTTYPE, type);
					this.$store.commit(SET_STARTTIME, '');
					this.$store.commit(SET_ENDTIME, '');
            		if (type !== 'comment') {
                        // 有子分类的获取子分类，再获取数据
                        self.$store.dispatch(GET_SORTBYTYPE).then(function (response) {
                            return self.$store.dispatch(GET_TABLEDATACOUNT);
                        }).then(function (response) {
                            return self.$store.dispatch(GET_TABLEDATA);
                        }).then(function (response) {
                            // 获取数据区间个数
                            return self.$store.dispatch(GET_CHARTDATA);
                        }).then(function (response) {
                            self.sum = response.total;
                            self.monthly = response.monthly;
                            self.initChart();
                        });
					} else {
                        // 评论没有分类，直接获取数据
                        self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                            return self.$store.dispatch(GET_TABLEDATA);
                        }).then(function (response) {
                            // 获取数据区间个数
                            return self.$store.dispatch(GET_CHARTDATA);
                        }).then(function (response) {
                            self.sum = response.total;
                            self.monthly = response.monthly;
                            self.initChart();
                        });
					}
				}
            },
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
                var option = {};
                if (self.selectedFSortType !== 'book') {
                    option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        grid: {
                            height: self.tableHeight - 50,
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
                } else {
                    option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        grid: {
                            height: self.tableHeight + 20,
                            top: 10,
                            left: '3%',
                            right: '4%',
                            containLabel: true
                        },
                        xAxis: {
                            data: self.chartData.xAxis,
                            boundaryGap: true,
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
                        },
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series: self.chartData.data
                    };
                }

                // 使用刚指定的配置项和数据显示图表。
                self.myChart.setOption(option);
            }
        },
		// 此生命周期挂载阶段还没开始，所以适用于修改父级dom和数据准备操作
        created: function () {
            // 打开此view应该设置顶部菜单和子级菜单的选中状态
			const pId = this.$route.meta.pId;
			const path = this.$route.path;
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

            // 先获取文章、笔记、评论、图书的总数
            self.$store.dispatch(GET_ANALYZECOUNT).then(function (response) {
                // 再根据当前父分类获取子分类列表
                return self.$store.dispatch(GET_SORTBYTYPE);
            }).then(function (response) {
                // 获取数据总个数
                return self.$store.dispatch(GET_TABLEDATACOUNT);
            }).then(function (response) {
                // 获取表中数据
                return self.$store.dispatch(GET_TABLEDATA);
            }).then(function (response) {
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

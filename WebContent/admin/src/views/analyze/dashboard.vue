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
                            <div class="dashboard-count-desc">文章总数(比上月趋势)</div>
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
                            <div class="dashboard-count-desc">笔记总数(比上月趋势)</div>
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
                            <div class="dashboard-count-desc">用户评论数(比上月趋势)</div>
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
                            <div class="dashboard-count-desc">上传图书量(比上月趋势)</div>
                        </div>
					</el-col>
					<el-col :span="4"></el-col>
				</el-row>
			</div>
		</div>

		<div class="details">
			<div class="details-header">
				<el-row :gutter="20">
					<el-col class="header-desc" :span="4">
						文章数据分布
					</el-col>
					<el-col class="header-details" :span="20">
						<router-link to="/home/data-note-add">查看详情</router-link>
						<i class="fa fa-download"></i>
					</el-col>
				</el-row>
			</div>
			<div class="details-container">
				<el-row :gutter="20">
					<el-col class="container-tip" :span="6">
						合计<span>1234</span>
						日均<span>120</span>
					</el-col>
					<el-col class="container-filter" :span="18">
							<el-select class="filter-sort" v-model="selectedSubSort" placeholder="请选择">
								<el-option
										v-for="(item, key) in subSortList"
										:label="item.label"
										:value="item.value"
                                        :key="key">
								</el-option>
							</el-select>
							<el-date-picker
									class="filter-time"
									v-model="value3"
									type="daterange"
									placeholder="选择日期范围">
							</el-date-picker>

					</el-col>
				</el-row>
			</div>
		</div>
		<!--分析 - 数据概览 - /home/analyze-dashboard
		<div id="main" style="width: 500px;height: 500px;" ref="abc"></div>
		<router-link to="/home/addNote">addNote</router-link>-->
	</div>

</template>

<script type="text/ecmascript-6">
	// 引入 ECharts 主模块
	var echarts = require('echarts/lib/echarts');
	require('echarts/lib/chart/bar');
	require('echarts/lib/component/tooltip');
	require('echarts/lib/component/title');

	import '../../css/analyze/dashboard.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    // 引入框架派发器
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../vuex/modules/fremework';
    // 引入此页面派发器
    import {
        SET_FSORTTYPE,
        SET_SUBSORTLIST
    } from '../../vuex/modules/analyze/dashboard';

    export default {
    	data: function () {
    		return {
				'overviewData' : {},
				value3: [new Date(2014, 10, 04, 10, 09), new Date(2016, 10, 04, 10, 09)],
			}
		},
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                selectedFSortType: state => state.analyzeDashboard.selectedFSortType,
                subSortList: state => state.analyzeDashboard.subSortList,
                selectedSubSort: state => state.analyzeDashboard.selectedSubSort,
            }),
			'articleTendency' : function () {
            	if (this.overviewData.articleTendency) {
					return this.overviewData.articleTendency.split('')[0] !== '-';
				} else {
            		return true;
				}
			},
			'noteTendency' : function () {
				if (this.overviewData.noteTendency) {
					return this.overviewData.noteTendency.split('')[0] !== '-';
				} else {
					return true;
				}
			},
			'commentTendency' : function () {
				if (this.overviewData.commentTendency) {
					return this.overviewData.commentTendency.split('')[0] !== '-';
				} else {
					return true;
				}
			},
			'bookTendency' : function () {
				if (this.overviewData.bookTendency) {
					return this.overviewData.bookTendency.split('')[0] !== '-';
				} else {
					return true;
				}
			}
        },
		filters:{
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
                'setActiveTopMenu',
                'setActiveChildMenu',

				'getAnalyzeCount',
                'setFSort',
                'getSortByType'
            ]),
            dashboardClick : function (type) {
                this.$store.commit(SET_FSORTTYPE, type);
                this.getSortByType();
            }
        },
		// 此生命周期挂载阶段还没开始，所以适用于修改父级dom和数据准备操作
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

			//console.info(this.getAnalyzeCount);

        },
		// 此声明周期挂载dom已经开始，适用于处理dom操作
		mounted: function () {
    		const self = this;
    		// 先获取文章、笔记、评论、图书的总数
			this.getAnalyzeCount().then(function (response) {
				self.overviewData = response.countData;
                return '';
			}).then(function (response) {
                // 再根据当前父分类获取子分类列表
                return self.getSortByType();
            }).then(function (response) {
                console.info(self.subSortList);
            });


		},

    }
</script>

<style scoped>

</style>

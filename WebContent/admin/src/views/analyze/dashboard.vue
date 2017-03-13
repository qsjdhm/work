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
									v-model="timeIntervalValue"
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
		SET_OVERVIEWDATA,
        SET_FSORTTYPE,
        SET_SUBSORTLIST,
		SET_SELECTEDSUBSORT,
		SET_TIMEINTERVAL
    } from '../../vuex/modules/analyze/dashboard';

    export default {
    	data: function () {
    		return {
				value6: '',
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
				timeInterval: state => state.analyzeDashboard.timeInterval,
            }),
			...mapGetters([
				'articleTendency',
				'noteTendency',
				'commentTendency',
				'bookTendency'
			]),
			subSortValue: {
				get: function () { return this.selectedSubSort; },
				set: function (newSort) {
					this.$store.commit(SET_SELECTEDSUBSORT, newSort);
					this.$store.commit(SET_TIMEINTERVAL, '');
				}
			},
			timeIntervalValue: {
				get: function () { return this.timeInterval; },
				set: function (newTime) {
					this.$store.commit(SET_TIMEINTERVAL, newTime);
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
            	// 父类变了再重新获取
            	if (type !== this.selectedFSortType) {
					this.$store.commit(SET_FSORTTYPE, type);
					this.$store.commit(SET_TIMEINTERVAL, '');
            		if (type !== 'comment') {
            			// 有子分类的获取子分类，再获取数据
						this.getSortByType();
					} else {
            			// 评论没有分类，直接获取数据
					}
				}
            }
        },
		// 此生命周期挂载阶段还没开始，所以适用于修改父级dom和数据准备操作
        created: function () {
            // 打开此view应该设置顶部菜单和子级菜单的选中状态
			const pId = this.$route.meta.pId;
			const path = this.$route.path;
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
				self.$store.commit(SET_OVERVIEWDATA, response.countData);
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

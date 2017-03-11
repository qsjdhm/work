<template>
	<div class="analyze-dashboard-page">
		<div class="dashboard">
			<div class="dashboard-header">
				系统数据概览
			</div>
			<div class="dashboard-container">
				<el-row :gutter="20">
					<el-col :span="5">
						{{overviewData.articleCount | formatNumber}}
						<span class="tendency-arrows">
							<i class="fa"
							   :class="{'fa-long-arrow-down': !articleTendency, 'fa-long-arrow-up': articleTendency}">
							</i>
							{{overviewData.articleTendency}}
						</span>
						<div class="dashboard-count-desc">文章总数(比上月趋势)</div>
					</el-col>
					<el-col :span="5">
						{{overviewData.noteCount | formatNumber}}
						<span class="tendency-arrows">
							<i class="fa"
							   :class="{'fa-long-arrow-down': !noteTendency, 'fa-long-arrow-up': noteTendency}">
							</i>
							{{overviewData.noteTendency}}
						</span>
						<div class="dashboard-count-desc">笔记总数(比上月趋势)</div>
					</el-col>
					<el-col :span="5">
						{{overviewData.commentCount | formatNumber}}
						<span class="tendency-arrows">
							<i class="fa"
							   :class="{'fa-long-arrow-down': !commentTendency, 'fa-long-arrow-up': commentTendency}">
							</i>
							{{overviewData.commentTendency}}
						</span>
						<div class="dashboard-count-desc">用户评论数(比上月趋势)</div>
					</el-col>
					<el-col :span="5">
						{{overviewData.bookCount | formatNumber}}
						<span class="tendency-arrows">
							<i class="fa"
							   :class="{'fa-long-arrow-down': !bookTendency, 'fa-long-arrow-up': bookTendency}">
							</i>
							{{overviewData.bookTendency}}
						</span>
						<div class="dashboard-count-desc">上传图书量(比上月趋势)</div>
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
							<el-select class="filter-sort" v-model="value" placeholder="请选择">
								<el-option
										v-for="item in options"
										:label="item.label"
										:value="item.value">
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
	// 引入柱状图
	require('echarts/lib/chart/bar');
	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip');
	require('echarts/lib/component/title');

	import '../../css/analyze/dashboard.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../vuex/modules/fremework';

    export default {
    	data: function () {
    		return {
				'overviewData' : {},
				options: [{
					value: '选项1',
					label: '黄金糕'
				}, {
					value: '选项2',
					label: '双皮奶'
				}, {
					value: '选项3',
					label: '蚵仔煎'
				}, {
					value: '选项4',
					label: '龙须面'
				}, {
					value: '选项5',
					label: '北京烤鸭'
				}],
				value: '',
				value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
			}
		},
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,
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

				'getAnalyzeCount'
            ]),

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
    		// 获取概览数据
			this.getAnalyzeCount().then(function (response) {
				self.overviewData = response.countData;
				console.info(self.overviewData);
			});


//			console.log("未开始编译1");
//			console.info(document.getElementById('main'));
//			// 基于准备好的dom，初始化echarts实例
//			var myChart = echarts.init(document.getElementById('main'));
//			// 绘制图表
//			myChart.setOption({
//				title: { text: 'ECharts 入门示例' },
//				tooltip: {},
//				xAxis: {
//					data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
//				},
//				yAxis: {},
//				series: [{
//					name: '销量',
//					type: 'bar',
//					data: [5, 20, 36, 10, 10, 20]
//				}]
//			});
		},

    }
</script>

<style scoped>

</style>

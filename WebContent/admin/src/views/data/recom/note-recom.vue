<template>
	<div class="data-note-recom-page">
        <div class="header">
            <el-row :gutter="20">
                <el-col class="header-title" :span="24">
					<div class="filter-package">
						<el-select class="filter-sort" v-model="classifyValue" placeholder="请选择">
							<el-option
									v-for="(item, key) in sortList"
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
						<el-button type="primary" @click="searchData">
							<i class="fa fa-search"></i>
							查询
						</el-button>
						<el-button @click="resetFilter">重置条件</el-button>
					</div>
                </el-col>
            </el-row>
        </div>
        <div class="container">
            <el-row class="container-data" :gutter="20">
                <el-col class="container-table" :span="24">
                    <div class="table-data">
						<el-table
								:data="tmpTableData"
								:height="tableHeight+148"
								:default-sort = "{prop: seq, order: descValue}"
								@sort-change="sortChangeHandle"
								style="width: 100%">
							<el-table-column
									prop="Article_ID"
									label="ID"
									sortable="custom"
									width="80">
							</el-table-column>
							<el-table-column
									prop="Article_Title"
									label="名称">
								<template scope="scope">
									<a :href="'#/home/data-article-edit/' + scope.row.Article_ID" >{{scope.row.Article_Title}}</a>
								</template>
							</el-table-column>
							<el-table-column
									prop="Uncomment_Num"
									label="新增评论"
									align="right"
									class-name="uncomment"
									width="100">
								<template scope="scope">
									<el-popover
											v-if="scope.row.Uncomment_List.length>0"
											trigger="hover"
											placement="top">
										<div
												style="border-bottom: 1px solid #dfe6ec;"
												v-for="(item, key) in scope.row.Uncomment_List"
												v-if="scope.row.Uncomment_List.length>0"
												:key="key">
											<p>姓名: {{ item.userName }}</p>
											<p>内容: {{ item.content }}</p>
										</div>
										<div slot="reference" class="name-wrapper">
											<a :href="'#/home/data-comment-edit/list/' + scope.row.Article_ID" ><span class="remind"></span>{{scope.row.Uncomment_Num}}</a>
										</div>
									</el-popover>
									<div
											v-if="scope.row.Uncomment_List.length==0"
											slot="reference"
											class="name-wrapper">
										{{ scope.row.Uncomment_Num }}
									</div>
								</template>
							</el-table-column>
							<el-table-column
									prop="Comment_Num"
									label="总评论"
									align="right"
									width="80">
								<template scope="scope">
									<el-popover v-if="scope.row.Comment_List.length>0" trigger="hover" placement="top">
										<div
												style="border-bottom: 1px solid #dfe6ec;"
												v-for="(item, key) in scope.row.Comment_List"
												:key="key">
											<p>姓名: {{ item.userName }}</p>
											<p>内容: {{ item.content }}</p>
										</div>
										<div slot="reference" class="name-wrapper">
											<a :href="'#/home/data-comment-edit/list/' + scope.row.Article_ID" >{{scope.row.Comment_Num}}</a>
										</div>
									</el-popover>
									<div v-if="scope.row.Comment_List.length==0" slot="reference" class="name-wrapper">
										{{ scope.row.Comment_Num }}
									</div>
								</template>
							</el-table-column>
							<el-table-column
									prop="Read_Num"
									label="点击量"
									align="left"
									sortable="custom"
									width="150">
								<template scope="scope">
									<el-input-number size="small"
													 :min="1"
													 :step="20"
													 @change="recomChangeHandle(scope.row)"
													 v-model="scope.row.Read_Num"></el-input-number>
								</template>
							</el-table-column>
							<el-table-column
									prop="Recommend_Num"
									label="推荐量"
									align="left"
									sortable="custom"
									width="150">
								<template scope="scope">
									<el-input-number size="small"
													 :min="1"
													 :step="20"
													 @change="recomChangeHandle(scope.row)"
													 v-model="scope.row.Recommend_Num"></el-input-number>
								</template>
							</el-table-column>
							<el-table-column
									prop="Article_Date"
									sortable="custom"
									label="时间"
									:formatter="formatterTableTime"
									width="125">
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
</template>

<script type="text/ecmascript-6">

    import '../../../css/data/recom/note-recom.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_SORTLIST,
        SET_CLASSIFY,
        SET_STARTTIME,
        SET_ENDTIME,
		SET_SEQ,
		SET_DESC,
        SET_TABLEPAGE,

        GET_SORTLIST,
        GET_TABLEDATACOUNT,
        GET_TABLEDATA,
		RECOM_NOTE
    } from '../../../vuex/modules/data/recom/note-recom';

    export default {
        data: function () {
            return {
                tableHeight : 0, // table的高度
				sortRequest : false  // 是否允许排序字段远程请求数据
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                sortList: state => state.dataNoteRecom.sortList,
                classify: state => state.dataNoteRecom.classify,
                startTime: state => state.dataNoteRecom.startTime,
                endTime: state => state.dataNoteRecom.endTime,
				seq: state => state.dataNoteRecom.seq,
				desc: state => state.dataNoteRecom.desc,
                tableCount: state => state.dataNoteRecom.tableCount,
                tablePage: state => state.dataNoteRecom.tablePage,
                tableData: state => state.dataNoteRecom.tableData,
            }),
            // 分类切换事件
            classifyValue: {
                get: function () { return this.classify; },
                set: function (newClassify) {
                    this.$store.commit(SET_CLASSIFY, newClassify);
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
                }
            },
            // 排序顺序
            descValue: function () {
                return this.desc + 'ending';
            },
			// 本地数据，因为vuex不允许v-model修改数据值，所以要转一下
			tmpTableData: function () {
				let tempData = [];
				for (let i = 0, len = this.tableData.length; i < len; i++) {
					tempData.push({
						'Article_ID' : this.tableData[i].Article_ID,
						'Article_Title' : this.tableData[i].Article_Title,
						'Sort_Name' : this.tableData[i].Sort_Name,
						'Comment_Num' : this.tableData[i].Comment_Num,
						'Comment_List' : this.tableData[i].Comment_List,
						'Uncomment_Num' : this.tableData[i].Uncomment_Num,
						'Uncomment_List' : this.tableData[i].Uncomment_List,
						'Read_Num' : this.tableData[i].Read_Num,
						'Recommend_Num' : this.tableData[i].Recommend_Num,
						'Article_Date' : this.tableData[i].Article_Date
					});
				}
				return tempData;
			}
        },

        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setChildMenuShow',
                'setActiveTopMenu',
                'setActiveChildMenu'
            ]),
            // 根据条件查询数据
            searchData(event) {
                let self = this;
                self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                    self.$store.dispatch(GET_TABLEDATA);
                });
            },
            // 重置条件
            resetFilter(event) {
                this.$store.commit(SET_CLASSIFY, '0');
                this.$store.commit(SET_STARTTIME, '');
                this.$store.commit(SET_ENDTIME, '');
                let self = this;
                self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
                    self.$store.dispatch(GET_TABLEDATA);
                });
            },
            // 翻页事件
            tablePageChange(val) {
                this.$store.commit(SET_TABLEPAGE, val);
                // 重新获取当前页的table表数据
                this.$store.dispatch(GET_TABLEDATA);
            },
			// 列排序事件
			sortChangeHandle(prop) {
            	// 排序事件会在vue的生命周期mounted之前，所以添加一个sortRequest限制排序远程请求数据什么时候可以开始请求
				if (prop.order && prop.prop && this.sortRequest) {
					let desc = '';
					if (prop.order === 'ascending') {
						desc = 'asc';
					} else {
						desc = 'desc';
					}
					let self = this;
					self.$store.commit(SET_DESC, desc);
					self.$store.commit(SET_SEQ, prop.prop);
					self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
						self.$store.dispatch(GET_TABLEDATA);
					});
				}
			},
            // 格式化处理表格的时间数据格式
            formatterTableTime(row, column) {
                return row.Article_Date.split(' ')[0];
            },
			// input计数器响应事件
			recomChangeHandle(row) {
				let self = this;
				self.$store.dispatch(RECOM_NOTE, {
					'id' : row.Article_ID,
					'recommendNum' : row.Recommend_Num,
					'readNum' : row.Read_Num
				}).then(function (response) {
					console.info(response);
					if (response.data.success === '1') {
						self.$message({
							message: response.data.msg,
							type: 'success'
						});
					} else {
						self.$message.error('推荐笔记出错');
					}
				});
			},
        },
        created: function () {
            // 打开此view应该设置顶部菜单和子级菜单的选中状态
            let pId = this.$route.meta.pId;
            let path = this.$route.path;
            const self = this;
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
                this.setActiveChildMenu(path);
            }
        },
        mounted: function () {
            const self = this;
            // 设置table高度
            this.tableHeight = document.getElementById("frameworkContainer").offsetHeight - 260;
            // 获取分类列表
            self.$store.dispatch(GET_SORTLIST).then(function (response) {
                // 获取数据总个数
                return self.$store.dispatch(GET_TABLEDATACOUNT);
            }).then(function (response) {
                // 获取数据区间个数
                self.$store.dispatch(GET_TABLEDATA);
                self.sortRequest = true;
            });
        }
    }
</script>

<style scoped>

</style>

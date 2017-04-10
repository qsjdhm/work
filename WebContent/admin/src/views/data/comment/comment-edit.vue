<template>
	<div class="data-comment-edit-page">
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
                            :data="tableData"
                            :height="tableHeight+148"
							:default-sort = "{prop: seq, order: descValue}"
							@sort-change="sortChangeHandle"
                            style="width: 100%">
                            <el-table-column
                                prop="Comment_ID"
                                label="ID"
								sortable="custom"
                                width="80">
                            </el-table-column>
							<el-table-column
								prop="Comment_ArticleTitle"
								label="评论文章">
								<template scope="scope">
									<el-popover trigger="hover" placement="top">
										<p>{{ scope.row.Comment_ArticleTitle }}</p>
										<div slot="reference" class="name-wrapper">
											{{ scope.row.Comment_ArticleTitle }}
										</div>
									</el-popover>
								</template>
							</el-table-column>
							<el-table-column
								prop="Comment_Content"
								label="内容">
								<template scope="scope">
									<el-popover trigger="hover" placement="top">
										<p>{{ scope.row.Comment_Content }}</p>
										<div slot="reference" class="name-wrapper">
											{{ scope.row.Comment_Content }}
										</div>
									</el-popover>
								</template>
							</el-table-column>
							<el-table-column
								prop="Comment_Person_Name"
								label="评论人"
								width="120">
								<template scope="scope">
									<el-popover v-if="scope.row.Comment_Person_Email!=''" trigger="hover" placement="top">
										<p>需要回复此评论人（{{ scope.row.Comment_Person_Email }}）吗？</p>
										<div style="text-align: right; margin: 0">
											<el-button size="mini" type="text">取消</el-button>
											<el-button type="primary" size="mini">回复</el-button>
										</div>
										<div slot="reference" class="name-wrapper">
											{{ scope.row.Comment_Person_Name }}
										</div>
									</el-popover>
									<div v-if="scope.row.Comment_Person_Email==''" slot="reference" class="name-wrapper">
										{{ scope.row.Comment_Person_Name }}
									</div>
								</template>
							</el-table-column>
							<el-table-column
								prop="Comment_Read"
								class-name="uncomment"
								sortable="custom"
								label="状态"
								width="100">
								<template scope="scope">
									<div v-if="scope.row.Comment_Read==0" style="color: #ff5500;" slot="reference" class="name-wrapper">
										未读
									</div>
									<div v-if="scope.row.Comment_Read!=0" slot="reference" class="name-wrapper">
										已读
									</div>
								</template>
							</el-table-column>
                            <el-table-column
                                prop="Comment_Time"
                                sortable="custom"
                                label="时间"
                                :formatter="formatterTableTime"
								width="125">
                            </el-table-column>
							<el-table-column
									fixed="right"
									label="操作"
									width="120">
								<template scope="scope">
									<el-button
											type="text"
											size="small"
											@click.native.prevent="editRow(scope.$index, scope.row)">
										修改
									</el-button>
								</template>
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

    import '../../../css/data/comment/comment-edit.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../../vuex/modules/fremework';

    // 引入此页面派发器
    import {
        SET_CLASSIFY,
        SET_STARTTIME,
        SET_ENDTIME,
		SET_SEQ,
		SET_DESC,
        SET_TABLEPAGE,

        GET_TABLEDATACOUNT,
        GET_TABLEDATA
    } from '../../../vuex/modules/data/comment/comment-edit';

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

                sortList: state => state.dataCommentEdit.sortList,
                classify: state => state.dataCommentEdit.classify,
                startTime: state => state.dataCommentEdit.startTime,
                endTime: state => state.dataCommentEdit.endTime,
				seq: state => state.dataCommentEdit.seq,
				desc: state => state.dataCommentEdit.desc,
                tableCount: state => state.dataCommentEdit.tableCount,
                tablePage: state => state.dataCommentEdit.tablePage,
                tableData: state => state.dataCommentEdit.tableData,
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
			// 编辑单行选中数据事件
			editRow(index, row) {
            	// 弹框，赋默认值



//				let self = this;
//				self.$store.dispatch(DEL_ARTICLE, id).then(function(response) {
//					if (response.data.success === '1') {
//						self.$message({
//							message: response.data.msg,
//							type: 'success'
//						});
//					} else {
//						self.$message.error('删除文章出错');
//					}
//					return self.$store.dispatch(GET_TABLEDATACOUNT);
//				}).then(function (response) {
//					self.$store.dispatch(GET_TABLEDATA);
//				});
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
                return row.Comment_Time.split(' ')[0];
            }
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
			// 获取数据总个数
            self.$store.dispatch(GET_TABLEDATACOUNT).then(function (response) {
				// 获取数据区间个数
				self.$store.dispatch(GET_TABLEDATA);
				self.sortRequest = true;
            });
        }
    }
</script>

<style scoped>

</style>

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
								prop="Comment_Content"
								label="评论内容">
								<template scope="scope">
									<a :href="'#/home/data-comment-edit/details/' + scope.row.Comment_ID" >{{scope.row.Comment_Content}}</a>
								</template>
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
								prop="Comment_Person_Name"
								label="评论人"
								width="120">
								<template scope="scope">
									<el-popover v-if="scope.row.Comment_Person_Email!=''" trigger="hover" placement="top">
										<p>需要回复此评论人（{{ scope.row.Comment_Person_Email }}）吗？</p>
										<div style="text-align: right; margin: 0">
											<el-button size="mini" type="text">取消</el-button>
											<el-button type="primary" size="mini" @click.native.prevent="replyRow(scope.$index, scope.row)">回复</el-button>
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
									<div v-if="scope.row.Comment_Read==0" style="" slot="reference" class="name-wrapper">
										<a :href="'#/home/data-comment-edit/details/' + scope.row.Comment_ID" >未读</a>
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

        <!-- 修改评论弹框 -->
        <el-dialog title="修改评论" :close-on-click-modal="false" :close-on-press-escape="false" v-model="editModelVisible">
            <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="评论人" prop="Comment_Person_Name">
                    <el-input :disabled="true" v-model="editRuleForm.Comment_Person_Name"></el-input>
                </el-form-item>
                <el-form-item label="评论文章" prop="Comment_ArticleTitle">
                    <el-input :disabled="true" v-model="editRuleForm.Comment_ArticleTitle"></el-input>
                </el-form-item>
                <el-form-item label="评论内容" prop="Comment_Content">
                    <el-input type="textarea" v-model="editRuleForm.Comment_Content" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editModelVisible=false">取 消</el-button>
                <el-button type="primary" @click="submitEditForm('editRuleForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 回复评论弹框 -->
        <el-dialog title="回复评论" :close-on-click-modal="false" :close-on-press-escape="false" v-model="replyModelVisible">
            <el-form :model="replyRuleForm" :rules="replyRules" ref="replyRuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="评论文章" prop="Comment_ArticleTitle">
                    <el-input :disabled="true" v-model="replyRuleForm.Article_Title"></el-input>
                </el-form-item>
                <el-form-item label="评论内容" prop="Comment_Content">
                    <el-input :disabled="true" type="textarea" v-model="replyRuleForm.Comment_Content" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                </el-form-item>
                <el-form-item label="回复内容" prop="Reply_Content">
                    <el-input type="textarea" v-model="replyRuleForm.Reply_Content" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="replyModelVisible=false">取 消</el-button>
                <el-button type="primary" @click="submitReplyForm('replyRuleForm')">确 定</el-button>
            </div>
        </el-dialog>
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
        SET_TABLEDATA,
        SET_SELECTEDCOMMENT,

        GET_TABLEDATACOUNT,
        GET_TABLEDATA,
        UPDATE_COMMENT,
        REPLY_COMMENT
    } from '../../../vuex/modules/data/comment/comment-edit';

    export default {
        data: function () {
            return {
                tableHeight : 0, // table的高度
				sortRequest : false,  // 是否允许排序字段远程请求数据

                editModelVisible: false,
                editRules: {
                    Comment_Person_Name: [{required: true, message: '请输入评论人名称', trigger: 'blur'}],
                    Comment_ArticleTitle: [{required: true, message: '请输入评论文章名称', trigger: 'blur'}],
                    Comment_Content: [{required: true, message: '请输入评论内容', trigger: 'blur'}],
                },

                replyModelVisible: false,
                replyRules: {
                    Article_Title: [{required: true, message: '请输入评论文章名称', trigger: 'blur'}],
                    Comment_Content: [{required: true, message: '请输入评论内容', trigger: 'blur'}],
                    Reply_Content: [{required: true, message: '请输入回复内容', trigger: 'blur'}],
                }
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
                selectedComment: state => state.dataCommentEdit.selectedComment,
            }),
            // 编辑评论的数据
            editRuleForm: function () {
                let self = this;
                return {
                    Comment_ID : self.selectedComment.Comment_ID,
                    Comment_Person_Name : self.selectedComment.Comment_Person_Name,
                    Comment_ArticleTitle : self.selectedComment.Comment_ArticleTitle,
                    Comment_Content : self.selectedComment.Comment_Content
                };
            },
            // 回复评论的数据
            replyRuleForm: function () {
                let self = this;
                return {
                    Reply_Name : '52doit系统消息',
                    Reply_Email : 'qsjdhm@163.com',
                    Reply_Content : '',
                    Article_ID : self.selectedComment.Comment_ArticleID,
                    Article_Title : self.selectedComment.Comment_ArticleTitle,
                    fComment_ID : self.selectedComment.Comment_ID,
                    Comment_Content : self.selectedComment.Comment_Content,
                };
            },
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
                this.editModelVisible = true;
                this.$store.commit(SET_SELECTEDCOMMENT, row);
			},
            // 回复评论
            replyRow(index, row) {
                // 弹框，赋默认值
                this.replyModelVisible = true;
                this.$store.commit(SET_SELECTEDCOMMENT, row);
            },
            // 编辑评论提交数据事件
            submitEditForm: function (formName) {
                let self = this;
                this.$refs[formName].validate(function(valid) {
                    if (valid) {
                        // 验证成功提交数据
                        self.$store.commit(SET_SELECTEDCOMMENT, self.editRuleForm);
                        self.$store.dispatch(UPDATE_COMMENT).then(function (response) {
                            self.editModelVisible = false;
                            if (response.data.success === '1') {
                                self.$message({
                                    message: response.data.msg,
                                    type: 'success'
                                });
                            } else {
                                self.$message.error('修改评论出错');
                            }
                            return self.$store.dispatch(GET_TABLEDATACOUNT);
                        }).then(function (response) {
                            self.$store.dispatch(GET_TABLEDATA);
                        });
                    } else {
                        console.log('error update!!');
                        return false;
                    }
                });
            },
            // 回复评论提交数据事件
            submitReplyForm: function (formName) {
                let self = this;
                this.$refs[formName].validate(function(valid) {
                    if (valid) {
                        // 验证成功提交数据
                        self.$store.dispatch(REPLY_COMMENT, {
                            name: self.replyRuleForm.Reply_Name,
                            email: self.replyRuleForm.Reply_Email,
                            content: self.replyRuleForm.Reply_Content,
                            articleID: self.replyRuleForm.Article_ID,
                            articleTitle: self.replyRuleForm.Article_Title,
                            fCommentID: self.replyRuleForm.fComment_ID
                        }).then(function (response) {
                            self.replyModelVisible = false;
                            if (response.data.success === '1') {
                                self.$message({
                                    message: response.data.msg,
                                    type: 'success'
                                });
                            } else {
                                self.$message.error('回复评论出错');
                            }
                            return self.$store.dispatch(GET_TABLEDATACOUNT);
                        }).then(function (response) {
                            self.$store.dispatch(GET_TABLEDATA);
                        });
                    } else {
                        console.log('error update!!');
                        return false;
                    }
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
                return row.Comment_Time.split(' ')[0];
            }
        },
        created: function () {
            const self = this;
            // 打开此view应该设置顶部菜单和子级菜单的选中状态
            let pId = this.$route.meta.pId;
            let params = this.$route.params;
            let path = this.$route.path;
            // 如果是url后带有type参数，要默认选中
            if (params.type) {
                path = path.split('/'+params.type)[0] + '/2';
                this.$store.commit(SET_CLASSIFY, params.type);
            }

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

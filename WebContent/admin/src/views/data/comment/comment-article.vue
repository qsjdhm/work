<template>
	<div class="data-comment-article-page">
		<div class="header">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home/data-dashboard' }">功能地图</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/home/data-comment-edit/2' }">评论列表</el-breadcrumb-item>
                <el-breadcrumb-item>所属文章 :  {{articleTitle}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
            <div class="table-data">
                <el-table
                    border
                    :data="commentList"
                    :height="tableHeight+188"
                    style="width: 100%">
                    <el-table-column
                        :label="'文章：'+articleTitle+'的评论列表'">
                        <el-table-column
                            prop="Comment_ID"
                            label="ID"
                            sortable
                            width="80">
                        </el-table-column>
                        <el-table-column
                            prop="Comment_Content"
                            label="内容">
                        </el-table-column>
                        <el-table-column
                            prop="Comment_Person_Name"
                            label="评论人"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="Comment_Read"
                            class-name="uncomment"
                            sortable
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
                            sortable
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
                                    @click.native.prevent="replyRow(scope.$index, scope.row)">
                                    回复
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
		</div>

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

	import '../../../css/data/comment/comment-article.less';

	import { mapGetters, mapState, mapActions } from 'vuex';
	import {
		SET_TOPACTIVEMENU,
		SET_CHILDACTIVEMENU
	} from '../../../vuex/modules/fremework';

	// 引入此页面派发器
	import {
        SET_ARTICLEID,
        SET_ARTICLETITLE,
        SET_COMMENTLIST,
        SET_SELECTEDCOMMENT,

        GET_ARTICLE,
        GET_COMMENTLIST,
        REPLY_COMMENT
	} from '../../../vuex/modules/data/comment/comment-article';


    export default {
        data: function () {
            return {
                tableHeight: 0,
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

                articleId: state => state.dataCommentArticle.articleId,
                articleTitle: state => state.dataCommentArticle.articleTitle,
                commentList: state => state.dataCommentArticle.commentList,
                selectedComment: state => state.dataCommentArticle.selectedComment,
            }),
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
        },

        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setChildMenuShow',
                'setActiveTopMenu',
                'setActiveChildMenu'
            ]),
            // 回复评论
            replyRow(index, row) {
                let self = this;
                // 弹框，赋默认值
                this.replyModelVisible = true;
                this.$store.commit(SET_SELECTEDCOMMENT, {
					Comment_Person_Name: row.Comment_Person_Name,
					Comment_Content: row.Comment_Content,
					Comment_ArticleID: self.articleId,
					Comment_ArticleTitle: self.articleTitle,
					Comment_ID: row.Comment_ID
                });
            },
            // 回复评论提交数据事件
            submitReplyForm: function (formName) {
                let self = this;
                this.$refs[formName].validate(function(valid) {
                	console.info(self.replyRuleForm);
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
                            self.$store.dispatch(GET_COMMENTLIST);
                        });
                    } else {
                        console.log('error update!!');
                        return false;
                    }
                });
            },
            // 格式化处理表格的时间数据格式
            formatterTableTime(row, column) {
                return row.Comment_Time.split(' ')[0];
            }
        },
        created: function () {
            // 打开此view应该设置顶部菜单和子级菜单的选中状态
            let pId = this.$route.meta.pId;
            let params = this.$route.params;
			let path = this.$route.path;
            // 如果是详情页
            if (params.articleId) {
				path = path.split('/list/'+params.articleId)[0]+'/2';
                this.$store.commit(SET_ARTICLEID, params.articleId);
			}
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
			// 获取文章标题
			let self = this;
            this.tableHeight = document.getElementById("frameworkContainer").offsetHeight - 260;
			self.$store.dispatch(GET_ARTICLE).then(function(response){
                // 获取文章的评论列表
				self.$store.dispatch(GET_COMMENTLIST);
			});
        }
    }
</script>

<style scoped>

</style>

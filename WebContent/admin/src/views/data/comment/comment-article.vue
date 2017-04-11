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
                    :height="tableHeight+148"
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
                                    @click.native.prevent="editRow(scope.$index, scope.row)">
                                    回复
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>

		</div>
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

        GET_ARTICLE,
        GET_COMMENTLIST
	} from '../../../vuex/modules/data/comment/comment-article';


    export default {
        data: function () {
            return {

            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

                articleId: state => state.dataCommentArticle.articleId,
                articleTitle: state => state.dataCommentArticle.articleTitle,
                commentList: state => state.dataCommentArticle.commentList,
            }),
        },

        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setChildMenuShow',
                'setActiveTopMenu',
                'setActiveChildMenu'
            ]),
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
			self.$store.dispatch(GET_ARTICLE).then(function(response){
                // 获取文章的评论列表
				self.$store.dispatch(GET_COMMENTLIST);
			});
        }
    }
</script>

<style scoped>

</style>

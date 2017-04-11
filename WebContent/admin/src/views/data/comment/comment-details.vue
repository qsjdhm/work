<template>
	<div class="data-comment-details-page">
		<div class="header">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home/data-dashboard' }">功能地图</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/home/data-comment-edit/2' }">评论列表</el-breadcrumb-item>
				<el-breadcrumb-item>所属文章 :  {{articleTitle}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-input type="textarea" v-model="contentvalue" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

	import '../../../css/data/comment/comment-details.less';

	import { mapGetters, mapState, mapActions } from 'vuex';
	import {
		SET_TOPACTIVEMENU,
		SET_CHILDACTIVEMENU
	} from '../../../vuex/modules/fremework';

	// 引入此页面派发器
	import {
		SET_ID,

		GET_COMMENT
	} from '../../../vuex/modules/data/comment/comment-details';


	export default {
		data: function () {
			return {

			}
		},
		computed: {
			// 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
			...mapState({
				topActiveMenu: state => state.fremework.topActiveMenu,

				name: state => state.dataCommentDetails.name,
				content: state => state.dataCommentDetails.content,
				articleTitle: state => state.dataCommentDetails.articleTitle,
			}),
			contentvalue: function() {
				return this.name + '说 : ' + this.content;
			}
		},

		methods: {
			// 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
			...mapActions([
				'setChildMenuShow',
				'setActiveTopMenu',
				'setActiveChildMenu',
				'getUnreadComment'
			]),
		},
		created: function () {
			// 打开此view应该设置顶部菜单和子级菜单的选中状态
			let pId = this.$route.meta.pId;
			let params = this.$route.params;
			let path = this.$route.path;
			// 如果是详情页
			if (params.commentId) {
				path = path.split('/details/'+params.commentId)[0]+'/2';
				this.$store.commit(SET_ID, params.commentId);
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
			let self = this;
			// 获取评论内容
			this.$store.dispatch(GET_COMMENT).then(function () {
				// 获取未读评论
				self.getUnreadComment();
			});
		}
	}
</script>

<style scoped>

</style>

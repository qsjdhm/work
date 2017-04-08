<template>
	<div class="data-article-details-page">
		<div class="header">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/home/data-dashboard' }">功能地图</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/home/data-article-edit' }">文章列表</el-breadcrumb-item>
				<el-breadcrumb-item>ID : {{id}} - 名称 :  {{name}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-select class="classify" :disabled="isSubmit" v-model="classifyValue" placeholder="请选择">
				<el-option
						v-for="(item, key) in sortList"
						:label="item.label"
						:value="item.value"
						:key="key">
				</el-option>
			</el-select>
			<el-input class="name" :disabled="isSubmit" v-model="nameValue" placeholder="请输入文章标题"></el-input>
			<script id="content" name="content" type="text/plain"></script>
			<div class="tag-package">
				<el-select
						class="tags"
						v-model="selectedTag"
						:disabled="isSubmit"
						multiple
						placeholder="请选择文章标签">
					<el-option
							v-for="(item, key) in tagList"
							:label="item.label"
							:value="item.value"
							:key="key">
					</el-option>
				</el-select>
			</div>
			<el-button
					v-if="!isSubmit"
					@click="submitData"
					type="primary">
				<i class="fa fa-cloud-upload"></i>
				修改文章
			</el-button>
			<el-button
					v-if="isSubmit"
					type="primary"
					:loading="true">
				提交文章中
			</el-button>
			<el-button @click="resetData">重置数据</el-button>
		</div>
    </div>
</template>

<script type="text/ecmascript-6">
	// 富文本
	import '../../../assets/ueditor1.6.1/ueditor.config';
	import '../../../assets/ueditor1.6.1/ueditor.all.min';
	import '../../../assets/ueditor1.6.1/ueditor.parse';
	import '../../../assets/ueditor1.6.1/lang/zh-cn/zh-cn';
	import '../../../assets/ueditor1.6.1/themes/default/css/ueditor.css';

	import '../../../css/data/article/article-details.less';

	import { mapGetters, mapState, mapActions } from 'vuex';
	import {
		SET_TOPACTIVEMENU,
		SET_CHILDACTIVEMENU
	} from '../../../vuex/modules/fremework';

	// 引入此页面派发器
	import {
		SET_SORTLIST,
		SET_CLASSIFY,
		SET_ID,
		SET_NAME,
		SET_CONTENT,
		SET_TAGLIST,
		SET_TAG,
		SET_ISSUBMIT,

		GET_SORTLIST,
		GET_TAGLIST,
		GET_ARTICLE,

		SUBMIT_DATA
	} from '../../../vuex/modules/data/article/article-details';


    export default {
        data: function () {
            return {
				editor : null,
				selectedTag : []
            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                topActiveMenu: state => state.fremework.topActiveMenu,

				sortList: state => state.dataArticleDetails.sortList,
				classify: state => state.dataArticleDetails.classify,
				id: state => state.dataArticleDetails.id,
				name: state => state.dataArticleDetails.name,
				content: state => state.dataArticleDetails.content,
				tagList: state => state.dataArticleDetails.tagList,
				tag: state => state.dataArticleDetails.tag,
				isSubmit: state => state.dataArticleDetails.isSubmit,
            }),
			// 分类切换
			classifyValue: {
				get: function () { return this.classify; },
				set: function (newClassify) {
					this.$store.commit(SET_CLASSIFY, newClassify);
				}
			},
			// 名称切换
			nameValue: {
				get: function () { return this.name; },
				set: function (newName) {
					this.$store.commit(SET_NAME, newName);
				}
			}
        },

        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setChildMenuShow',
                'setActiveTopMenu',
                'setActiveChildMenu'
            ]),
			// 添加文章
			submitData: function (event) {
				// 设置当前from不可编辑
				let self = this;
				self.$store.commit(SET_ISSUBMIT, true);
				self.editor.setDisabled();

				// 设置内容
				self.$store.commit(SET_CONTENT, UE.getEditor("content").getContent());
				// 设置标签
				self.$store.commit(SET_TAG, this.selectedTag);
				// 触发action提交文章内容
				self.$store.dispatch(SUBMIT_DATA).then(function(response){
					// 设置当前from可编辑
					self.$store.commit(SET_ISSUBMIT, false);
					self.editor.setEnabled();
					if (response.data.success === '1') {
						self.$message({
							message: response.data.msg,
							type: 'success'
						});
					} else {
						self.$message.error('添加文章出错');
					}
				});
			},
			// 重置当前数据
			resetData: function (event) {
				this.$store.commit(SET_CLASSIFY, this.sortList[0].value);
				this.$store.commit(SET_NAME, '');
				this.$store.commit(SET_CONTENT, '');
				this.editor.setContent('');
				this.selectedTag = [];
			}
        },
        created: function () {
            // 打开此view应该设置顶部菜单和子级菜单的选中状态
            let pId = this.$route.meta.pId;
            let params = this.$route.params;
			let path = this.$route.path;
            // 如果是详情页
            if (params.detailsId) {
				path = path.split('/'+params.detailsId)[0];
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
			// 初始化富文本组件
			this.editor = new UE.ui.Editor({
				initialContent: "",  // 初始化时显示的内容
				focus: false,  // 是否聚焦
				initialFrameWidth: 820,  // 设置宽度
				initialFrameHeight: 400,  // 设置宽度
				autoClearinitialContent: true,  // focus时自动清空初始化时的内容
				autoHeightEnabled: false
			});
			this.editor.render("content");

			console.info(this.$route.params.detailsId);

			// 获取分类列表
			let self = this;
			self.$store.dispatch(GET_SORTLIST).then(function(response){
				return self.$store.dispatch(GET_TAGLIST);
			}).then(function(response){
				self.$store.commit(SET_ID, self.$route.params.detailsId);
				return self.$store.dispatch(GET_ARTICLE);
			}).then(function(response){
				self.editor.setContent(self.content);
				for (let i = 0, len = self.tag.length; i < len; i++) {
					self.selectedTag.push(self.tag[i]);
				}
			});
        }
    }
</script>

<style scoped>

</style>

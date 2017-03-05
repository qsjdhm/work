<template>
	<div class="framework-page">
		<div class="framework-nav">
			<div class="framework-logo">
				<img src="../assets/logo.png"/>
				<span>MANAGE</span>
			</div>
			<div class="framework-menu">
				<el-menu
						:unique-opened=true
						:default-active="activeMenu"
						class="el-menu-vertical-demo"
						@select="handleSelect"
						@open="handleOpen"
						@close="handleClose"
				>
					<el-menu-item index="dashboard"><i class="el-icon-menu"></i>文章管理</el-menu-item>
					<el-submenu index="1">
						<template slot="title"><i class="el-icon-message"></i>文章管理</template>
						<el-menu-item index="addNote">添加文章</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="el-icon-setting"></i>文章管理</template>
						<el-menu-item index="delNote">添加文章</el-menu-item>
					</el-submenu>
				</el-menu>
			</div>
		</div>
		<div class="framework-header">

		</div>

		<div class="framework-container">
			<router-view></router-view>
		</div>

		<div class="framework-footer">
			52DOIT 版权所有 © 2017 由不拽注定被甩~技术支持
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	// 引入界面样式
	import '../css/framework.less';

	import { mapGetters, mapState, mapActions } from 'vuex';
	import {
		SET_ACTIVEMENU
	} from '../vuex/modules/FremeworkPage';

	export default {
		computed: {
			// 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
			...mapState({
				activeMenu: state => state.FremeworkPage.activeMenu
			})
		},
		methods: {
			handleSelect: function(menu,b,c) {
				this.$store.commit(SET_ACTIVEMENU, menu);
				console.info('菜单点击了：');
				console.info(this.$store.state.FremeworkPage.activeMenu);
				window.location.href = this.$store.state.BASE_URL + "/admin/#/home/" + menu;

//				console.info(a);
//				console.info(b);
//				console.info(c);
			},
			handleOpen: function() {

			},
			handleClose: function() {

			},
		},
		created: function () {
			console.info(this.$store.state.FremeworkPage.activeMenu);
			//在实例创建之后同步调用。此时实例已经结束解析选项，这意味着已建立：数据绑定，计算属性，方法，watcher/事件回调。
			//但是还没有开始 DOM 编译，$el 还不存在,但是实例存在,即this.a存在,可打印出来 。
			console.log("framework建立");
			//console.info(this);
			//window.location.href = this.$store.state.BASE_URL + "/admin/#/home/";
		},
	}
</script>

<style scoped>


</style>

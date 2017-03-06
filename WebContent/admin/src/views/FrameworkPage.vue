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
						:default-active="activeMenu.path"
						class="el-menu-vertical-demo"
						@select="handleSelect"
						@open="handleOpen"
						@close="handleClose">
					<el-menu-item index="/home/dashboard"><i class="el-icon-menu"></i>系统首页</el-menu-item>
					<el-submenu
                        v-for="(menuGroup, key, index) in menuList"
                        :index="menuGroup.name"
                        :key="key">
						<template slot="title"><i class="el-icon-message"></i>{{menuGroup.name}}</template>
                        <el-menu-item
                            v-for="(subMenu, subKey, subIndex) in menuGroup.subMenu"
                            :index="subMenu.path"
                            :key="subKey">
                            {{subMenu.name}}
                        </el-menu-item>
					</el-submenu>
				</el-menu>
			</div>
		</div>
		<div class="framework-header">
			<el-row :gutter="20">
				<el-col :span="16">
					<div class="grid-content bg-purple">
						<el-select @change="handleChange" v-model="activeMenu.name" filterable placeholder="快速菜单入口">
							<el-option-group
									v-for="menuGroup in menuList"
									:label="menuGroup.name">
								<el-option
										v-for="menu in menuGroup.subMenu"
										:label="menu.name"
										:value="menu.path">
								</el-option>
							</el-option-group>
						</el-select>
					</div>
				</el-col>
				<el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
			</el-row>
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
                menuList: state => state.FremeworkPage.menuList,
				activeMenu: state => state.FremeworkPage.activeMenu
			})
		},
		methods: {
			handleSelect: function(menu,b,c) {
				let obj = {};
				if (menu === '/home/dashboard') {
					obj.path = '/home/dashboard';
					obj.name = '系统首页';
				} else {
					// 循环activeMenu找出对应的菜单
					for (let i=0, len=this.menuList.length; i<len; i++) {
						for (let j=0, jLen=this.menuList[i].subMenu.length; j<jLen; j++) {
							if (this.menuList[i].subMenu[j].path === menu) {
								obj.path = menu;
								obj.name = this.menuList[i].subMenu[j].name;
								break;
							}
						}
					}
				}
				console.info(obj);

				// 创建dom之前，根据当前路由给菜单设置默认选项
				this.$store.commit(SET_ACTIVEMENU, obj);
				console.info(menu);
				console.info(b);
				//this.$store.commit(SET_ACTIVEMENU, menu);
				console.info('菜单点击了：');
				console.info(this.$store.state.FremeworkPage.activeMenu);
			},
			handleOpen: function() {

			},
			handleClose: function() {

			},
			handleChange: function(menu,a) {
				console.info(222222);
				console.info(menu);
				console.info(a);
			},
		},
		created: function () {
			//console.info(this.$store.state.FremeworkPage.activeMenu);
			//在实例创建之后同步调用。此时实例已经结束解析选项，这意味着已建立：数据绑定，计算属性，方法，watcher/事件回调。
			//但是还没有开始 DOM 编译，$el 还不存在,但是实例存在,即this.a存在,可打印出来 。
			//console.log("framework建立");
			//console.info(this);
			//window.location.href = this.$store.state.BASE_URL + "/admin/#/home/";
		},
	}
</script>

<style scoped>


</style>

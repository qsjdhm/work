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
                        v-for="(menuGroup, key) in menuList"
                        :index="menuGroup.name"
                        :key="key">
						<template slot="title"><i class="el-icon-message"></i>{{menuGroup.name}}</template>
                        <el-menu-item
                            v-for="(subMenu, subKey) in menuGroup.subMenu"
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
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<el-select
								class="search-select"
								v-model="menuSelectValue"
								filterable
								placeholder="快速菜单入口">
							<el-option-group
									v-for="(menuGroup, groupKey)  in menuList"
									:key="groupKey"
									:label="menuGroup.name">
								<el-option
										v-for="(menu, key) in menuGroup.subMenu"
										:key="key"
										:label="menu.name"
										:value="menu.path">
								</el-option>
							</el-option-group>
						</el-select>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple">
						<el-row :gutter="20">
							<el-col :span="12">
								<div class="now-date">
									<i class="el-icon-date"></i>{{nowDate}}<span>|</span>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="system-settings">
									<i class="el-icon-date"></i>{{nowDate}}
								</div>
							</el-col>
						</el-row>
					</div>
				</el-col>
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
			}),
			// 搜索菜单栏当前菜单
			menuSelectValue: {
				get: function () {
					if (this.activeMenu.name === '系统首页') {
						return '';
					} else {
						return this.activeMenu.path;
					}
				},
				set: function (menu) {
					const self = this;
					this.setCurrentMenu(menu).then(function(){
						// 设置完成之后跳转页面
						window.location.href = self.$store.state.BASE_URL + '/admin/#' + menu;
					});
				}
			},
			nowDate: function () {
				var date = new Date();
				return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
			}
		},
		methods: {
			// 映射 this.keywordChange() 为 action中的方法  this.$store.dispatch('increment')
			...mapActions([
				'setCurrentMenu'
			]),
			handleSelect: function(menu) {
				const self = this;
				this.setCurrentMenu(menu).then(function(){
					// 设置完成之后跳转页面
					window.location.href = self.$store.state.BASE_URL + '/admin/#' + menu;
				});
			},
			handleOpen: function() {

			},
			handleClose: function() {

			}
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

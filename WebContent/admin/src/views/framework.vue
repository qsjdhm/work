<template>
	<div class="framework-page">
		<div class="framework-header">
			<el-row :gutter="20">
				<el-col :span="4">
					<div class="grid-content bg-purple">
                        <div class="framework-logo">
                            <img src="../assets/logo.png"/>
                            <span>MANAGE</span>
                        </div>
					</div>
				</el-col>
				<el-col class="framework-toolbar" :span="20">
					<div class="grid-content bg-purple">
                        <div class="framework-top-menu">
                            <el-menu
									:default-active="topActiveMenu"
									class="el-menu-demo"
									mode="horizontal"
									@select="topMenuSelect">
                                <el-menu-item
										v-for="(topMenu, topKey) in menuList"
										:index="topMenu.id"
										:key="topKey">
									<i class="fa" :class="topMenu.icon"></i>{{topMenu.name}}
								</el-menu-item>
							</el-menu>
                        </div>
                        <span class="slicer">|</span>
                        <div class="now-date">
							{{nowDate}}
                        </div>
                        <span class="slicer">|</span>
                        <div class="system-settings">
                            <el-badge :value="unreadComment" class="item unread-message">
                                <i class="fa fa-bell-o"></i>
                            </el-badge>
                            <i class="setting fa fa-cog"></i>
                            <i class="user fa fa-user-circle-o"><span>张三</span></i>
                            <i @click="signOut" class="logout fa fa-sign-out"></i>
                        </div>
					</div>
				</el-col>
			</el-row>
		</div>

        <div class="framework-nav">
            <div class="framework-child-menu">
                <el-menu
                    v-if="childMenuShow"
                    :unique-opened=false
                    :default-active="childActiveMenu"
                    class="el-menu-vertical-demo"
                    @select="childMenuSelect"
                    @open="childMenuOpen"
                    @close="childMenuClose">

					<!--
					如果是最底级菜单是具备点击页面跳转功能，所以它的index指向于path，方便直接获取使用
					而二级菜单只具备展开功能，菜单本身没有path属性，所以index指向于index属性
					 -->
					<!-- 没有子菜单时 -->
                    <el-menu-item
							v-for="(menuGroup, key) in childMenuList"
							v-if="!menuGroup.childMenu"
							:index="menuGroup.path"
							:key="key">
						<i :class="menuGroup.icon" class="fa"></i>{{menuGroup.name}}
					</el-menu-item>

					<!-- 有子菜单时 -->
                    <el-submenu
                        v-for="(menuGroup, key) in childMenuList"
						v-if="menuGroup.childMenu"
                        :index="menuGroup.id"
                        :key="key">
                        <template slot="title"><i :class="menuGroup.icon" class="fa"></i>{{menuGroup.name}}</template>
                        <el-menu-item
                            v-for="(subMenu, subKey) in menuGroup.childMenu"
                            :index="subMenu.path"
                            :key="subKey">
                            {{subMenu.name}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </div>

		<div class="framework-container" id="frameworkContainer">
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
        SET_CHILDMENUSHOW,
		SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
	} from '../vuex/modules/fremework';

	export default {
        data: function () {
            return {
                nowDate: this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
        },
		computed: {
			// 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
			...mapState({
                childMenuShow: state => state.fremework.childMenuShow,
                menuList: state => state.fremework.menuList,
				topActiveMenu: state => state.fremework.topActiveMenu,
                childActiveMenu: state => state.fremework.childActiveMenu,
				unreadComment: state => state.fremework.unreadComment,
			}),
			// 子菜单列表
			childMenuList : function () {
				let subMenu = [];
				for (let i = 0, len = this.menuList.length; i < len; i++) {
					if (this.menuList[i].id === this.topActiveMenu) {
						subMenu = this.menuList[i].childMenu;
						break;
					}
				}
				console.info('计算属性：');
				console.info(subMenu);
				return subMenu;
			},
		},
		methods: {
			// 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
			...mapActions([
                'setChildMenuShow',
				'setActiveTopMenu',
                'setActiveChildMenu',
				'getUnreadComment'
			]),

            // 组件响应方法

            // 顶级菜单选择事件
			topMenuSelect: function(topMenu) {
                const self = this;
                this.setChildMenuShow(false).then(function () {
                    return self.setActiveTopMenu(topMenu);
                }).then(function () {
                    // 通过v-if，使每次切换顶级菜单时，让浏览器重新渲染子菜单组件，达到切换顶级菜单后默认选中第一个子菜单
                    return self.setChildMenuShow(true);
                }).then(function () {
                    let dashboardPath = self.getDashboardMenu(topMenu);
                    return self.setActiveChildMenu(dashboardPath);
                }).then(function () {
                    // 设置完成之后跳转页面
                    window.location.href = self.$store.state.BASE_URL + '/admin/#' + self.childActiveMenu;
                });
			},
            // 子菜单选择事件
            childMenuSelect: function(menu) {
				const self = this;
				this.setActiveChildMenu(menu).then(function () {
					// 设置完成之后跳转页面
					window.location.href = self.$store.state.BASE_URL + '/admin/#' + menu;
				});
			},
            childMenuOpen: function() {},
            childMenuClose: function() {},

			// dom触发事件方法
			signOut: function () {
				delete localStorage.workUser;
				window.location.href = this.$store.state.BASE_URL + '/admin';
			},


            // 功能性方法

            // 根据顶级菜单的id，返回此顶级菜单下第一个可点击的子菜单
            getDashboardMenu: function (topMenuId) {
                let dashboardPath = '';
                let subMenu = [];
                for (let i = 0, len = this.menuList.length; i < len; i++) {
                    if (this.menuList[i].id === topMenuId) {
                        subMenu = this.menuList[i].childMenu;
                        break;
                    }
                }

                // 如果第一个数据菜单就存在path
                if (subMenu[0].path) {
                    dashboardPath = subMenu[0].path;
                } else {
                    // 不存在从子级里面找
                    dashboardPath = subMenu[0].childMenu[0].path;
                }

                return dashboardPath;
            },
            // 格式化日期
            formatDate: function(date, format) {
                let paddNum = function(num){
                    num += "";
                    return num.replace(/^(\d)$/,"0$1");
                };
                // 指定格式字符
                let cfg = {
                    yyyy : date.getFullYear() //年 : 4位
                    ,yy : date.getFullYear().toString().substring(2)//年 : 2位
                    ,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
                    ,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
                    ,d  : date.getDate()   //日 : 如果1位的时候不补0
                    ,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
                    ,hh : paddNum(date.getHours())  //时
                    ,mm : paddNum(date.getMinutes()) //分
                    ,ss : paddNum(date.getSeconds()) //秒
                };
                format || (format = "yyyy-MM-dd hh:mm:ss");
                return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
            }
        },
		created: function () {
            var self = this;
            setInterval(function(){
                self.nowDate = self.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
            },1000);

            // 获取未读评论
			self.getUnreadComment();
			//console.info(this.$store.state.FremeworkPage.activeMenu);
			//在实例创建之后同步调用。此时实例已经结束解析选项，这意味着已建立：数据绑定，计算属性，方法，watcher/事件回调。
			//但是还没有开始 DOM 编译，$el 还不存在,但是实例存在,即this.a存在,可打印出来 。
			//console.log("framework建立");
			//console.info(this);
			//window.location.href = this.$store.state.BASE_URL + "/admin/#/home/";
		}
	}
</script>

<style scoped>


</style>

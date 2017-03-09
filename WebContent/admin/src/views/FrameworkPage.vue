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
                            <el-menu default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                                <el-menu-item index="1"><i class="fa fa-bar-chart"></i>分析</el-menu-item>
                                <el-menu-item index="2"><i class="fa fa-database"></i>数据管理</el-menu-item>
                                <el-menu-item index="3"><i class="fa fa-cogs"></i>系统设置</el-menu-item>
								<el-menu-item index="4"><i class="fa fa-picture-o"></i>图库</el-menu-item>
							</el-menu>
                        </div>
                        <span class="slicer">|</span>
                        <div class="now-date">
                            <!--<i class="fa fa-calendar"></i>-->
							{{nowDate}}
                        </div>
                        <span class="slicer">|</span>
                        <div class="system-settings">
                            <el-badge value="3" class="item unread-message">
                                <i class="fa fa-bell-o"></i>
                            </el-badge>
                            <i class="setting fa fa-cog"></i>
                            <i class="user fa fa-user-circle-o"><span>张三</span></i>
                            <i class="logout fa fa-sign-out"></i>
                        </div>
					</div>
				</el-col>
			</el-row>
		</div>

        <div class="framework-nav">
            <div class="framework-child-menu">
                <el-menu
                    :unique-opened=true
                    :default-active="activeMenu.path"
                    class="el-menu-vertical-demo"
                    @select="handleSelect"
                    @open="handleOpen"
                    @close="handleClose">
                    <el-menu-item index="/home/dashboard"><i class="fa fa-line-chart"></i>数据概览</el-menu-item>
                    <el-submenu
                        v-for="(menuGroup, key) in menuList"
                        :index="menuGroup.name"
                        :key="key">
                        <template slot="title"><i :class="menuGroup.icon" class="fa"></i>{{menuGroup.name}}</template>
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
        data: function () {
            return {
                nowDate: this.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
        },
		computed: {
			// 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
			...mapState({
                menuList: state => state.FremeworkPage.menuList,
				activeMenu: state => state.FremeworkPage.activeMenu
			}),
			// 搜索菜单栏当前菜单
			menuSelectValue: {
				get: function () {
					if (this.activeMenu.name === '数据概览') {
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

			},
            //格式化日期
            formatDate: function(date, format) {
                let paddNum = function(num){
                    num += "";
                    return num.replace(/^(\d)$/,"0$1");
                };
                //指定格式字符
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

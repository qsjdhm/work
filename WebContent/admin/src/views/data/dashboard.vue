<template>
	<div class="data-dashboard-page">
        <div class="m-function-list">
            <ul>
                <li
                    v-for="(menu, key) in menuList[1].childMenu"
                    v-if="menu.name!=='功能地图'"
                    :index="menu.id"
                    :key="key"
                    class="m-function-item">
                    <div>
                        <div class="m-f-menu-header">
                            <span class="m-f-menu-tip">{{menu.name}}</span>
                        </div>
                        <div class="m-f-menu-list">
                            <ul class="block__list block__list_words">
                                <li
                                    v-for="(subMenu, subKey) in menu.childMenu"
                                    :index="subMenu.id"
                                    :key="key">
                                    <router-link :to="subMenu.path">{{subMenu.name}}</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>

            </ul>
        </div>
	</div>
</template>

<script type="text/ecmascript-6">


	import '../../css/data/dashboard.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    // 引入框架派发器
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../vuex/modules/fremework';

    export default {
    	data: function () {
    		return {

			}
		},
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                childMenuShow: state => state.fremework.childMenuShow,
                menuList: state => state.fremework.menuList,
                topActiveMenu: state => state.fremework.topActiveMenu,
                childActiveMenu: state => state.fremework.childActiveMenu,
            }),
        },
        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setChildMenuShow',
                'setActiveTopMenu',
                'setActiveChildMenu',
            ]),

        },
		// 此生命周期挂载阶段还没开始，所以适用于修改父级dom和数据准备操作
        created: function () {
            // 打开此view应该设置顶部菜单和子级菜单的选中状态
			const pId = this.$route.meta.pId;
			const path = this.$route.path;
            const self = this;
            // 如果路由中当前页面的state中的选中顶级菜单不同需要设置顶级菜单和与之对应的子菜单
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
                // 否则只需要设置子菜单选中项
                this.setActiveChildMenu(path);
            }
        },
		// 此声明周期挂载dom已经开始，适用于处理dom操作
        mounted: function () {

		},

    }
</script>

<style scoped>

</style>

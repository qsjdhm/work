<template>
	<div>
        分析 - 图书分析 - 热度分析 - /home/analyze-book-heat
		<router-link to="/home/data-note-add">数据管理 - 新增笔记</router-link>
	</div>

</template>

<script type="text/ecmascript-6">
    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_CHILDMENUSHOW,
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../../vuex/modules/fremework';

    export default {
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                childMenuShow: state => state.fremework.childMenuShow,
                topActiveMenu: state => state.fremework.topActiveMenu,
            }),
        },
        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
                'setChildMenuShow',
                'setActiveTopMenu',
                'setActiveChildMenu'
            ]),

        },
        created: function () {
            // 打开此view应该设置顶部菜单和子级菜单的选中状态
            let pId = this.$route.meta.pId;
            let path = this.$route.path;
            const self = this;
            if (this.topActiveMenu !== pId) {
                this.setActiveTopMenu(pId).then(function () {
                    self.setActiveChildMenu(path);
                });

                this.setChildMenuShow(false).then(function () {
                    return self.setActiveTopMenu(pId);
                }).then(function () {
                    // 通过v-if，使每次切换顶级菜单时，让浏览器重新渲染子菜单组件，达到切换顶级菜单后默认选中第一个子菜单
                    return self.setChildMenuShow(true);
                }).then(function () {
                    self.setActiveChildMenu(path);
                });
            }
        },
    }
</script>

<style scoped>

</style>

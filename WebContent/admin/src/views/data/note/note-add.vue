<template>
	<div>
        数据管理 - 文章管理 - 添加笔记 - /home/data-note-add
		<router-link to="/home/addNote">addNote</router-link>
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
                topActiveMenu: state => state.fremework.topActiveMenu,
            }),
        },
        methods: {
            // 映射 this.setActiveTopMenu() 为 action中的方法  this.$store.dispatch('setActiveTopMenu')
            ...mapActions([
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
            }
        },
    }
</script>

<style scoped>

</style>

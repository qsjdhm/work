<template>
	<div class="data-cog-admin-page">
		<div class="header">
			当您填写管理员信息的时候请尽量填写完整, 以保证管理员的正常使用.
		</div>
    </div>
</template>

<script type="text/ecmascript-6">

    import '../../css/cog/cog-admin.less';

    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_TOPACTIVEMENU,
        SET_CHILDACTIVEMENU
    } from '../../vuex/modules/fremework';

    // 引入此页面派发器
//    import {
//        SET_SORTLIST,
//        SET_CLASSIFY,
//        SET_NAME,
//        SET_HEIGHT,
//        SET_COVER,
//        SET_LINK,
//        SET_ISSUBMIT,
//
//        GET_SORTLIST,
//        SUBMIT_DATA
//    } from '../../../vuex/modules/data/book/book-add';

    export default {
        data: function () {
            return {

            }
        },
        computed: {
            // 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
            ...mapState({
                uploadUrl: state => state.BASE_URL+'/UniversalUploadAction',
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

        }
    }
</script>

<style scoped>

</style>

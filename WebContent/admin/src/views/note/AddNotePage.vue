<template>
	<div>
		add note page
		<router-link to="/home/delNote">delNote</router-link>
	</div>
</template>

<script type="text/ecmascript-6">
	import { mapGetters, mapState, mapActions } from 'vuex';
//    import {
//        SET_TOPACTIVEMENU,
//        SET_CHILDACTIVEMENU
//    } from '../vuex/modules/fremework';

	export default {

		methods: {

		},
		created: function () {
//			const obj = {
//				'path' : this.$route.fullPath,
//				'name' : this.$route.name
//			};
//			// 创建dom之前，根据当前路由给菜单设置默认选项
//			this.$store.commit(SET_ACTIVEMENU, obj);
		},
	}
</script>

<style scoped>

</style>

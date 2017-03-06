<template>
	<div>
		del note page
		<router-link to="/home/dashboard">dashboard</router-link>
	</div>
</template>

<script type="text/ecmascript-6">
    import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_ACTIVEMENU
    } from '../../vuex/modules/FremeworkPage';
	export default {
		computed: {

		},
		methods: {

		},
		created: function () {
			//在实例创建之后同步调用。此时实例已经结束解析选项，这意味着已建立：数据绑定，计算属性，方法，watcher/事件回调。
			//但是还没有开始 DOM 编译，$el 还不存在,但是实例存在,即this.a存在,可打印出来 。
			console.log("del建立");
            this.$store.commit(SET_ACTIVEMENU, 'addNote');
		},
	}
</script>

<style scoped>

</style>

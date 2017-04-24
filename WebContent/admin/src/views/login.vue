<template>
    <div class="htmleaf-container">
        <div class="wrapper">
            <div class="container">
                <h1>Welcome</h1>
                <form class="form">
                    <input :value="username" @input="usernameHandler" type="text" placeholder="Username" />
                    <input :value="password" @input="passwordHandler" type="password" placeholder="Password" />
                    <button @click="loginSystemHandler">Login</button>
                </form>
            </div>
            <ul className="bg-bubbles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    // 引入界面样式
    import '../css/login.less';

	import { mapGetters, mapState, mapActions } from 'vuex';
    import {
        SET_USERNAME,
        SET_PASSWORD
    } from '../vuex/modules/login';

	export default {
		computed: {
			// 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
			...mapState({
				username: state => state.login.username,
				password: state => state.login.password
			})
		},
		methods: {
			// 映射 this.keywordChange() 为 action中的方法  this.$store.dispatch('increment')
			...mapActions([
				'loginSystem'
			]),
            usernameHandler: function (e) {
                this.$store.commit(SET_USERNAME, e.target.value);
			},
            passwordHandler: function (e) {
                this.$store.commit(SET_PASSWORD, e.target.value);
            },
            loginSystemHandler: function (e) {
                const self = this;
                this.$store.dispatch('loginSystem').then(function (result) {
                    console.info(result);
                    if(result.success === "1"){
                        self.$message({
                            message: result.msg,
                            type: 'success'
                        });
                        localStorage["workUser"] = JSON.stringify(result.user);
                        window.location.href = self.$store.state.BASE_URL + "/admin/#/home/analyze-dashboard";
                    } else {
                        self.$message.error(result.msg);
                    }
                });
            }
		}
	}
</script>

<style scoped>

</style>

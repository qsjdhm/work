<template>
	<div>
		<h2>Login</h2>
		<p v-if="$route.query.redirect">
			You need to login first.
		</p>
		{{fullName}}
		<label><input v-model="fullName" placeholder="email"></label>
		<br>
		<button @click="loginClick()">login</button>
	</div>
</template>

<script>

	//import { getSearchKey } from '../vuex/getters';

	import { mapGetters, mapState, mapActions } from 'vuex';

	export default {
		vuex: {

		},
		computed: {
			// 因为用到了modules，所以正确的变量位置在store.state.LoginPage中
			...mapState({
				username: function(state) {
					console.info(state);
					return state.LoginPage.username;
				},
				password: state => state.LoginPage.password
			}),
			fullName: {
				// getter
				get: function () {
					return this.username;
				},
				// setter
				set: function (newValue) {
					console.info(newValue);
//					var names = newValue.split(' ')
//					this.firstName = names[0]
//					this.lastName = names[names.length - 1]
				}
			}
		},
		methods: {
			// 映射 this.keywordChange() 为 action中的方法  this.$store.dispatch('increment')
			...mapActions([
				'login'
			]),
			loginClick: function () {
				console.info(this.count);
				console.info(this.$store.state.LoginPage.username);
				this.login({username: this.username}).then(() => {
				});
			}
		}
	}
</script>

<style scoped>

</style>

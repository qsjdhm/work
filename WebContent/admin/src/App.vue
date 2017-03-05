<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
	import store from './vuex/store';
	export default {
		name: 'app',
		store: store
	}
</script>

<style>
	body {
		margin: 0;
		padding: 0;
	}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

}
</style>

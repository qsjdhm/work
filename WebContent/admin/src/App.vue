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
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;
}
</style>

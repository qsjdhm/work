import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from '@/views/LoginPage'
import About from '@/components/About'

import auth from '../utils/auth'

Vue.use(Router)

function requireAuth (to, from, next) {
	console.info(auth.loggedIn());
	if (!auth.loggedIn()) {
		next({
			path: '/',
			query: { redirect: to.fullPath }
		})
	} else {
		next()
	}
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginPage
    },
    {
		path: '/about',
		name: 'About',
		component: About,
		beforeEnter: requireAuth,
	},

  ]
})



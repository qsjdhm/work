import Vue from 'vue'
import Router from 'vue-router'
//import LoginPage from '@/views/LoginPage'
//import About from '@/components/About'
//import About2 from '@/components/About2'

import auth from '../utils/auth'

Vue.use(Router)

function directHome (to, from, next) {
    if (auth.loggedIn()) {
        next({
            path: '/home'
        })
    } else {
        next()
    }
}


function requireAuth (to, from, next) {
	if (!auth.loggedIn()) {
		next({
			path: '/',
			query: { redirect: to.fullPath }
		})
	} else {
		next()
	}
}

//const Login = r => require.ensure([], () => r(require('../views/LoginPage')), 'group-foo');
const Login = resolve => require(['../views/LoginPage'], resolve);
const About = resolve => require(['../components/About'], resolve);
const Note = resolve => require(['../components/About2'], resolve);




export default new Router({
    routes: [
        {
          path: '/',
          name: 'Login',
          component: Login,
          beforeEnter: directHome,
        },
        {
            path: '/home',
            name: 'Home',
            component: About,
            beforeEnter: requireAuth,
            children: [
                {
                    // 当 /user/:id/profile 匹配成功，
                    // UserProfile 会被渲染在 User 的 <router-view> 中
                    path: 'note',
                    component: Note
                }
            ]
        },
        //{
        //    path: '/error',
        //    name: 'Note',
        //    component: About2,
        //    beforeEnter: requireAuth
        //}
    ]
})



import Vue from 'vue'
import Router from 'vue-router'
//import LoginPage from '@/views/LoginPage'
//import About from '@/components/About'
//import About2 from '@/components/About2'

import auth from '../utils/auth'

Vue.use(Router)

function directFremework (to, from, next) {
    if (auth.loggedIn()) {
        next({
            path: '/home/dashboard'
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

const LoginPage     = resolve => require(['../views/LoginPage'], resolve);
const FrameworkPage = resolve => require(['../views/FrameworkPage'], resolve);
const DashboardPage = resolve => require(['../views/dashboard/DashboardPage'], resolve);
const AddNotePage   = resolve => require(['../views/note/AddNotePage'], resolve);
const DelNotePage   = resolve => require(['../views/note/DelNotePage'], resolve);


export default new Router({
    routes: [
        {
          path: '/',
          name: 'Login',
          component: LoginPage,
          beforeEnter: directFremework,
        },
        {
            path: '/home',
            name: 'Home',
            component: FrameworkPage,
            beforeEnter: requireAuth,
            children: [
                {
                    path: 'dashboard',
					name: '数据概览',
                    component: DashboardPage
                },
				{
					path: 'addNote',
					name: '新建笔记',
					component: AddNotePage
				},
				{
					path: 'delNote',
					name: '删除笔记',
					component: DelNotePage
				},
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



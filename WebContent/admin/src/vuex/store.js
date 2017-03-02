/**
 * Created by zhangyan on 17/2/20.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import middlewares from './middlewares';
import createLogger from 'vuex/dist/logger';
import * as state from './state';
import * as actions from './actions';
import * as getters from './getters';

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import LoginPage from './modules/LoginPage';

const debug = process.env.NODE_ENV !== 'production';

Vue.use(ElementUI);
Vue.use(Vuex);
Vue.config.debug = debug;

export default new Vuex.Store({
    state,
	actions,
	getters,
	modules: {
		LoginPage
	},
	strict: debug,
	middlewares: middlewares,
	plugins: [createLogger()]
})

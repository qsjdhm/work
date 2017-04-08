/**
 * Created by zhangyan on 17/2/20.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import middlewares from './middlewares';
import createLogger from 'vuex/dist/logger';
import * as state from './state';
import * as actions from './actions';
import * as getters from './getters';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import '../assets/font-awesome-4.7.0/css/font-awesome.min.css';


import login from './modules/login';
import fremework from './modules/fremework';

import analyzeDashboard from './modules/analyze/dashboard';
import analyzeArticlePV from './modules/analyze/article/article-pv';
import analyzeArticleData from './modules/analyze/article/article-data';

import dataDashboard from './modules/data/dashboard';
import dataArticleAdd from './modules/data/article/article-add';
import dataArticleEdit from './modules/data/article/article-edit';
import dataArticleDetails from './modules/data/article/article-details';

const debug = process.env.NODE_ENV !== 'production';

Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(VueResource);
Vue.config.debug = debug;

export default new Vuex.Store({
    state,
	actions,
	getters,
	modules: {
		login,
        fremework,

        // 分析
		analyzeDashboard,
        analyzeArticlePV,
        analyzeArticleData,

        // 数据
        dataDashboard,
        dataArticleAdd,
        dataArticleEdit,
		dataArticleDetails

	},
	strict: debug,
	middlewares: middlewares,
	plugins: [createLogger()]
})

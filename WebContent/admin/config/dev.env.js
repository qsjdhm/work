var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 全局变量--ajax请求时的项目根路径，因为开发环境下项目是放到tomcat的work目录下，所以url请求拼接应该为
  // http://localhost:8080/work/getNews，要调用接口所以要加上项目根路径
  baseUrl: '"/work"'
})

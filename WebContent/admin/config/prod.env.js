module.exports = {
  NODE_ENV: '"production"',
  // 全局变量--ajax请求时的项目根路径，因为生产环境下项目是放到tomcat的ROOT目录下，所以url请求拼接应该为
  // http://52doit.com/getNews，所以域名便是项目根路径，不需要加项目根路径
  baseUrl: '""'
}

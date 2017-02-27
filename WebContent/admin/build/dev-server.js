/**
 * Created by will on 2015/8/14.
 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev');

new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	historyApiFallback: true,
	headers: { "Access-Control-Allow-Origin": "*" },
	contentBase: __dirname,
	hot: true,
	quiet: false,
	noInfo: false,
	stats: { colors: true }
}).listen(3001, '127.0.0.1', function (err, result) {
    if (err) console.log(err);
    console.log('正在监听host.com:3001');
});







//// 引入依赖模块
//var express = require('express');
//var webpack = require('webpack');
//var config = require('./webpack.dev.js');
//
//// 创建一个express实例
//var app = express();
//
//// 对网站首页的访问返回 "Hello World!" 字样
////app.get('/', function (req, res) {
////    res.send('Hello World!');
////});
//
//// 调用webpack并把配置传递过去
//var compiler = webpack(config);
//
//// 使用 webpack-dev-middleware 中间件，搭建服务器
//var devMiddleware = require('webpack-dev-middleware')(compiler, {
//    publicPath: config.output.publicPath,
//    stats: {
//        colors: true,
//        chunks: false
//    }
//})
//
//// 使用 webpack-hot-middleware 中间件，实现热加载
//var hotMiddleware = require('webpack-hot-middleware')(compiler);
//
//// 为了修改html文件也能实现热加载，使用webpack插件来监听html源文件改变事件
//compiler.plugin('compilation', function (compilation) {
//    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//        // 发布事件
//        hotMiddleware.publish({ action: 'reload' });
//        cb();
//    })
//});
//
//// 注册中间件
//app.use(devMiddleware);
//app.use(hotMiddleware);
//
//// 监听 3001 端口，开启服务器
//app.listen(3001,'127.0.0.1', function (err) {
//    if (err) {
//        console.log(err);
//        return;
//    }
//    console.log('Listening at 127.0.0.1:3001');
//})
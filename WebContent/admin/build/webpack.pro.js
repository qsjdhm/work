// 引入依赖模块
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// 引入基本配置
var config = require('./webpack.base');

// 重新配置插件项
config.plugins = [
	// 位于生产环境下
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: '"production"'
		}
	}),

	// 自动生成html插件，如果创建多个HtmlWebpackPlugin的实例，就会生成多个页面
	new HtmlWebpackPlugin({
		// 生成html文件的名字，路径相对于输出文件所在的位置
		filename: '../index.html',
		// 源文件，路径相对于本文件所在的位置
		template: path.resolve(__dirname, '../src/template/dev_index.html'),
		// 需要引入entry里面的哪几个入口，如果entry里有公共模块，记住一定要引入
		chunks: ['vendors','special','index'],
		// 要把<script>标签插入到页面哪个标签里(body|true|head|false)
		inject: 'body',
		// 生成html文件的标题
		title:'',
		// hash如果为true，将添加hash到所有包含的脚本和css文件，对于解除cache很有用
		// minify用于压缩html文件，其中的removeComments:true用于移除html中的注释，collapseWhitespace:true用于删除空白符与换行符
	}),

	// 提取css单文件的名字，路径相对于输出文件所在的位置
	new ExtractTextPlugin("[name].css"),

	// 提取入口文件里面的公共模块
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendors',
		filename: 'vendors.js',
	}),

	// 压缩js代码
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		},
		// 排除关键字，不能混淆
		except:['$','exports','require']
	}),

	// 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
	new webpack.optimize.OccurenceOrderPlugin(),

	// 全局挂载插件，当模块使用这些变量的时候，wepback会自动加载，区别于window挂载
	new webpack.ProvidePlugin({
		$:"jquery",
		jQuery:"jquery",
		"window.jQuery":"jquery"
	})
];

// vue里的css也要单独提取出来
config.vue = {
	loaders: {
		css: ExtractTextPlugin.extract("css")
	}
};

// 开启source-map，生产环境下推荐使用cheap-source-map或source-map，后者得到的.map文件体积比较大，但是能够完全还原以前的js代码
config.devtool='source-map';
// 关闭source-map
// config.devtool=false;

module.exports = config;
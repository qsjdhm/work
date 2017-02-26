// 引入依赖模块
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// 引入基本配置
var config = require('./webpack.base');
// 必须修改原配置中网站运行时的访问路径，相当于绝对路径，修改完之后，当前配置文件下的很多相对路径都是相对于这个来设定；
// 注意：webpack-dev-server会实时的编译，但是最后的编译的文件并没有输出到目标文件夹，而是保存到了内存当中
config.output.publicPath = 'http://127.0.0.1:3001/dist/';

// 重新配置模块加载器
config.module= {
	// test是正则表达式，匹配要处理的文件；loader匹配要使用的loader，"-loader"可以省略；include把要处理的目录包括进来，exclude排除不处理的目录
	loaders: [
		//  使用vue-loader 加载 .vue 结尾的文件
		{
			test: /\.vue$/,
			loader: 'vue-loader',
			exclude: /node_modules/
		},
		// 使用babel 加载 .js 结尾的文件
		{
			test: /\.js$/,
			loader: 'babel',
			exclude: /node_modules/,
			query:{
				presets: ['es2015', 'stage-0'],
				plugins: ['transform-runtime']
			}
		},
		// 使用css-loader、autoprefixer-loader和style-loader 加载 .css 结尾的文件
		{
			test: /\.css$/,
			// 将样式抽取出来为独立的文件
			loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader"),
			exclude: /node_modules/
		},
		// 使用less-loader、autoprefixer-loader、css-loader和style-loade 加载 .less 结尾的文件
		{
			test: /\.less$/,
			// 将样式抽取出来为独立的文件
			loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader"),
			exclude: /node_modules/
		},
		// 加载图片
		{
			test: /\.(png|jpg|gif)$/,
			loader: 'url-loader',
			query: {
				// 把较小的图片转换成base64的字符串内嵌在生成的js文件里
				limit: 10000,
				// 路径和生产环境下的不同，要与修改后的publickPath相结合
				name: 'img/[name].[ext]?[hash:7]'
			}
		},
		// 加载图标
		{
			test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
			loader: 'file-loader',
			query: {
				limit: 10000,
				// 路径和生产环境下的不同，要与修改后的publickPath相结合
				name:'fonts/[name].[ext]?[hash:7]',
				prefix:'font'
			}
		},
	]
};

// 重新配置插件项
config.plugins = [
	// 位于开发环境下
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: '"development"'
		}
	}),

	// 自动生成html插件，如果创建多个HtmlWebpackPlugin的实例，就会生成多个页面
	new HtmlWebpackPlugin({
		// 生成html文件的名字，路径和生产环境下的不同，要与修改后的publickPath相结合，否则开启服务器后页面空白
		filename: '../index.html',
		// 源文件，路径相对于本文件所在的位置
		template: path.resolve(__dirname, '../src/template/dev_index.html'),
		// 需要引入entry里面的哪几个入口，如果entry里有公共模块，记住一定要引入
		chunks: ['vendors','index'],
		// 要把<script>标签插入到页面哪个标签里(body|true|head|false)
		inject: 'body',
		// 生成html文件的标题
		title:''
		// hash如果为true，将添加hash到所有包含的脚本和css文件，对于解除cache很有用
		// minify用于压缩html文件，其中的removeComments:true用于移除html中的注释，collapseWhitespace:true用于删除空白符与换行符
	}),

	// 提取css单文件的名字，路径和生产环境下的不同，要与修改后的publickPath相结合
	new ExtractTextPlugin("[name].css", {allChunks: true}),

	// 提取入口文件里面的公共模块
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendors',
		filename: 'vendors.js',
	}),

	// 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
	new webpack.optimize.OccurenceOrderPlugin(),

	// 模块热替换插件
	new webpack.HotModuleReplacementPlugin(),

	// 允许错误不打断程序
	new webpack.NoErrorsPlugin(),

	// 全局挂载插件
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

// 启用source-map，开发环境下推荐使用cheap-module-eval-source-map
config.devtool='cheap-module-eval-source-map';

// 为了实现热加载，需要动态向入口配置中注入 webpack-hot-middleware/client ，路径相对于本文件所在的位置
 var devClient = 'webpack-hot-middleware/client';
// 为了修改html文件也能实现热加载，需要修改上面的devClient变量，引入同级目录下的dev-client.js文件
var devClient = './build/dev-client';
// Object.keys()返回对象的可枚举属性和方法的名称
Object.keys(config.entry).forEach(function (name, i) {
	var extras = [devClient];
	config.entry[name] = extras.concat(config.entry[name]);
})

module.exports = config;
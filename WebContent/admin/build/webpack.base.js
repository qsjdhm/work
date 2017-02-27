// 引入依赖模块
//var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	//devServer: true,
	//hotComponents: true,
	// 其他解决方案
	resolve: {
		// require时省略的扩展名，遇到.vue结尾的也要去加载
		extensions: ['','.js', '.vue'],
		// 模块别名地址，方便后续直接引用别名，无须写长长的地址，注意如果后续不能识别该别名，需要先设置root
		alias:{
			'vue': 'vue/dist/vue.js'
		}
	},

	// 不进行打包的模块
	externals:{},

	// 模块加载器
	module: {
		// loader相当于gulp里的task，用来处理在入口文件中require的和其他方式引用进来的文件，test是正则表达式，匹配要处理的文件；loader匹配要使用的loader，"-loader"可以省略；include把要处理的目录包括进来，exclude排除不处理的目录
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
	},

	// 配置插件项
	plugins: [
        // 提取css单文件的名字，路径和生产环境下的不同，要与修改后的publickPath相结合
        new ExtractTextPlugin("[name].[contenthash].css", {allChunks: true}),

        // 提取入口文件里面的公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js',
        }),

        // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurenceOrderPlugin(),

        // 允许错误不打断程序
        new webpack.NoErrorsPlugin(),

    ]
};
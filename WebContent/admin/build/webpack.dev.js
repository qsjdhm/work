// 引入依赖模块
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// 引入基本配置
var webpackBase = require('./webpack.base');
// 必须修改原配置中网站运行时的访问路径，相当于绝对路径，修改完之后，当前配置文件下的很多相对路径都是相对于这个来设定；
// 注意：webpack-dev-server会实时的编译，但是最后的编译的文件并没有输出到目标文件夹，而是保存到了内存当中
//config.output.publicPath = 'http://127.0.0.1:3001/dist/';

var devConfig = Object.assign(webpackBase, {
    //devtool: 'cheap-module-eval-source-map',
    //devServer: true,
    //hotComponents: true,
    // 入口文件，路径相对于本文件所在的位置，可以写成字符串、数组、对象
    //entry: {
    //    // path.resolve([from ...], to) 将to参数解析为绝对路径
    //    index: path.resolve(__dirname, '../src/main.js'),
    //},
    //// 输出配置
    //output: {
    //    // 输出文件，路径相对于本文件所在的位置
    //    path: path.resolve(__dirname, '../dist/'),
    //
    //    // 设置publicPath这个属性会出现很多问题：
    //    // 1.可以看成输出文件的另一种路径，差别路径是相对于生成的html文件；
    //    // 2.也可以看成网站运行时的访问路径；
    //    // 3.该属性的好处在于当你配置了图片CDN的地址，本地开发时引用本地的图片资源，上线打包时就将资源全部指向CDN了，如果没有确定的发布地址不建议配置该属性，特别是在打包图片时，路径很容易出现混乱，如果没有设置，则默认从站点根目录加载
    //    publicPath: 'http://127.0.0.1:3001/',
    //
    //    // 基于文件的md5生成Hash名称的script来防止缓存
    //    filename: '[name].[hash].js',
    //    // 非主入口的文件名，即未被列在entry中，却又需要被打包出来的文件命名配置
    //    chunkFilename: '[id].[chunkhash].js'
    //},

    devtool: 'cheap-module-eval-source-map',
    devServer: true,
    hotComponents: true,
    entry: {
        index: [
            'webpack-dev-server/client?http://127.0.0.1:3001',//入口路径
            'webpack/hot/only-dev-server',
            path.resolve(__dirname, '../src/main.js')
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: 'http://127.0.0.1:3001/dist/',//html中资源加载地址
        hash: true,
        filename: 'index.js'
    },



    vue: {
        loaders: {
            css: ExtractTextPlugin.extract("css")
        }
    }
});


// 插件配置
devConfig.plugins = (webpackBase.plugins || []).concat(

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
    // 配置全局变量（不同环境加载不同配置文件）
    new webpack.ProvidePlugin({
        ENV: path.resolve(__dirname, "../config/dev")
    }),

    // 模块热替换插件
    new webpack.HotModuleReplacementPlugin(),

    // 位于开发环境下
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"development"'
        }
    }),

    // 全局挂载插件
    new webpack.ProvidePlugin({
        $:"jquery",
        jQuery:"jquery",
        "window.jQuery":"jquery",
        ENV: path.resolve(__dirname, "../config/dev")
    })
);

// 为了实现热加载，需要动态向入口配置中注入 webpack-hot-middleware/client ，路径相对于本文件所在的位置
// var devClient = 'webpack-hot-middleware/client';
// 为了修改html文件也能实现热加载，需要修改上面的devClient变量，引入同级目录下的dev-client.js文件
var devClient = './build/dev-client';
// Object.keys()返回对象的可枚举属性和方法的名称
Object.keys(devConfig.entry).forEach(function (name, i) {
    var extras = [devClient];
    devConfig.entry[name] = extras.concat(devConfig.entry[name]);
});


module.exports = devConfig;








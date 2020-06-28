const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin }  = require('clean-webpack-plugin')
const webpack = require('webpack')
const path = require("path")
const port = 10248
const BuildDonePlugin = require('./plugins/BuildDonePlugin')
//使用node的模块
module.exports = {
    //这就是我们项目编译的入口文件
    entry: "./src/dev/index.ts",
    output: {
        filename: "dev.js",
        path: path.resolve(__dirname, '../dist/dev')
    },
    resolve: {
        extensions: ['.ts','tsx','.js']
    },
    //这里可以配置一些对指定文件的处理
    //这里匹配后缀为ts或者tsx的文件
    //使用exclude来排除一些文件
    module:{
        rules:[
            {
                test:/\.tsx?$/,
                use:'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    watch:true,//默认false，不开启
    watchOptions:{
        ignored:/node-modules/,//忽略，默认为空
        aggregateTimeout:300,//默认300ms,监听文件发生变化等待300ms,再去执行
        poll:1000//轮询1s默认1000次
    },
    //这个参数就可以在webpack中获取到了
    devtool: 'inline-source-map',
    devServer:{
        open: true,
        //这个本地开发环境运行时是基于哪个文件夹作为根目录
        contentBase:'./dist/dev',
        //当你有错误的时候在控制台打出
        stats: 'errors-only',
        overlay: {
          warnings: true,
          errors: true
        },
        //不启动压缩
        compress: true,
        hot: true,
        host: 'localhost',
        port: port
    },
    //这里就是一些插件
    plugins:[
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./dist/dev']
        }),
        new HtmlWebpackPlugin({
            template: './template/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new BuildDonePlugin(()=>{console.log(`\n \n> Address:http://localhost:${port}`)})
    ]
}

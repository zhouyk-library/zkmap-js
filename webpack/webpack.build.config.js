const { CleanWebpackPlugin }  = require('clean-webpack-plugin')
const path = require("path")
//使用node的模块
module.exports = {
    //这就是我们项目编译的入口文件
    entry: "./src/map/index.ts",
    output: {
        filename: "zkmap.js",
        path: path.resolve(__dirname, '../dist/build')
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
    //这个参数就可以在webpack中获取到了
    devtool: false,
    //这里就是一些插件
    plugins:[
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./dist/build']
        })
    ]
}

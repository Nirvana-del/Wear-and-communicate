const { defineConfig } = require('@vue/cli-service')
var webpack = require("webpack")
module.exports = defineConfig({
    configureWebpack: {
        resolve: {
            extensions: [],
            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views',
            }
        }
    },
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '穿搭交流与推荐平台',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },
    //node_modules里的依赖默认是不会编译的,会导致es6语法在ie中的语法报错,
    //所以需要在vue.config.js中使用transpileDependencies属性配置node_modules中指定哪些文件夹或文件需要编译.
    transpileDependencies: true,
    lintOnSave: false,//关闭eslint
    devServer: {
        port: '8888',
        proxy: {
            '/api': {
                // target: 'http://10.33.36.231:8080',
                target: 'http://localhost:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                },
                ws: false
            },
            '/msg': {
                // 线上API地址
                // target: 'http://vapi.youlai.tech',
                // 本地API地址
                target: 'http://localhost:8899',
                changeOrigin: true,
                pathRewrite: {
                    '^/msg': ''
                },
            }
        },
        hot: true//自动保存
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ],
    }
})

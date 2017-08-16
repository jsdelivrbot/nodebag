const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const nodeEnvironment = process.env.NODE_ENV;

module.exports = {
    devServer: {
        port: 80,
        historyApiFallback: true,
        stats: {
            chunkModules: false,
            colors: true
        },
        proxy: {
            "/phoebus": {
                target: 'http://phoebussit.cnsuning.com/',
                // target: 'http://10.37.252.238/',
                secure: false
            }
        },
        contentBase: './src',
        disableHostCheck: true,
    },
    entry: {
        vendor: [
            'jquery/dist/jquery',
            'babel-polyfill',
            'admin-lte/bootstrap/js/bootstrap',
            'admin-lte/dist/js/app'
        ],
        ng: [
            'angular',
            'angular-sanitize',
            'ui-router',
            'ui-router/release/ng1/stateEvents',
            'angular-file-upload'
        ],
        app: [
            './src/main.js'
        ]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(process.cwd(), 'www')
    },
    resolve: {
        alias: {
            business: path.resolve(process.cwd(), 'src/business'),
            component: path.resolve(process.cwd(), 'src/component'),
            config: path.resolve(process.cwd(), 'src/config'),
            lib: path.resolve(process.cwd(), 'src/lib'),
            styles: path.resolve(process.cwd(), 'src/styles'),
        }
    },
    plugins: [
        new CleanWebpackPlugin(['www']),
        new webpack.DefinePlugin({
            'INCLUDE_ALL_MODULES': function includeAllModulesGlobalFn(modulesArray, application) {
                modulesArray.forEach(function executeModuleIncludesFn(moduleFn) {
                    moduleFn(application);
                });
            },
            ENVIRONMENT: JSON.stringify(nodeEnvironment)
        }),
        new CopyWebpackPlugin([{
            from: './src',
            to: './'
        }], {
            ignore: ['*.js', 'index.html']
        }),
        new CopyWebpackPlugin([{
            from: './src/lib',
            to: './lib'
        }]),
        new CopyWebpackPlugin([{
            from: './src/component/ueditor',
            to: './component/ueditor'
        }]),
        new ngAnnotatePlugin({
            add: true
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.ProvidePlugin({
            echarts: "echarts",
            "window.echarts": "echarts"
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve('src', 'index.html'),
            inject: 'body',
            chunksSortMode: function(chunk1, chunk2) {
                var orders = ['ng', 'vendor', 'app'];
                var order1 = orders.indexOf(chunk1.names[0]);
                var order2 = orders.indexOf(chunk2.names[0]);
                if (order1 > order2) {
                    return 1;
                } else if (order1 < order2) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'ng'
        })
    ],
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        plugins: ['transform-decorators-legacy'],
                        presets: ['es2015']
                    }
                }]
            }, {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(eot(\?.*)?|woff(\?.*)?|ttf(\?.*)?|svg(\?.*)?|woff2(\?.*)?)$/,
                use: ['file-loader?limit=1024&name=fonts/[name].[ext]']
            },
            {
                test: /\.(md|markdown)$/,
                use: ['html-loader', 'markdown-loader']
            },
            {
                test: /\.html/,
                exclude: /(node_modules)/,
                use: ['html-loader']
            },
            {
                test: /\.(png|jpg)$/,
                use: ['url-loader?name=images/[name].[ext]']
            }
        ]
    }
};
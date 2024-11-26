/*
 * @Author: freysu
 * @Date: 2024-11-18 05:05:32
 * @LastEditors: freysu
 * @LastEditTime: 2024-11-27 06:00:24
 * @Description: file content
 */
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './original_src/index.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'webpack_dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
  devServer: {
    host: '127.0.0.1',
    port: '8080',
    contentBase: path.resolve(__dirname, './'),
    compress: true,
    open: true,
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://music.163.com/',
        pathRewrite: { '': '' }, // 当前请求不需要复写
        changeOrigin: true,
        secure: false, // 设置支持https协议的代理
      },
    },
    // 添加一些必要的配置来避免冲突
    client: {
      overlay: true, // 显示错误和警告
    },
    watchFiles: ['original_src/**/*.js', 'index.html'], // 自定义监听的文件
  },
};

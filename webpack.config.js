/*
 * @Author: freysu
 * @Date: 2024-11-18 05:05:32
 * @LastEditors: freysu
 * @LastEditTime: 2024-11-27 06:46:20
 * @Description: file content
 */
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './original_src/index.js',
  // mode: 'development',
  mode: 'production',
  // devtool: 'source-map',
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
    compress: true,
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
  },
};

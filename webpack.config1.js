/*
 * @Author: freysu
 * @Date: 2024-11-18 05:05:32
 * @LastEditors: freysu
 * @LastEditTime: 2024-12-02 09:40:28
 * @Description: file content
 */
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './ttt_main.js',
  // mode: 'production',
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle_test.js',
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
};

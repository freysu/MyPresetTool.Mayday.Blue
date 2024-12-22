/*
 * @Author: freysu
 * @Date: 2024-11-18 05:05:32
 * @LastEditors: freysu
 * @LastEditTime: 2024-12-22 21:35:36
 * @Description: file content
 */
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './js/index.js',
  mode: 'production',
  // mode: 'development',
  // devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
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

const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    entry: './app/entry.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'link:href', 'source:src']
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url-loader',
        options: {
          limit: 2048,
          name: '[name]-[hash].[ext]'
        }
      },
      {
        test: /\.png$|\.mp3$|\.ico$/, loader: 'url-loader',
        options: {
          limit: 2048,
          name: '[name]-[hash].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    }),
    new webpack.ProvidePlugin({
      // $: 'jquery',
      jQuery: 'jquery'
    }),
    new ExtractTextPlugin({
      filename: "[name]-[contenthash].css",
      disable: process.env.NODE_ENV !== 'production'
    }),
  ],
  output: {
    filename: "[name]-[chunkhash].js",
    path: path.resolve(__dirname, 'dist')
  }
};

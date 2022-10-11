const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    entry: './app/entry.js',
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: './dist'
    }
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attributes: {
              list: [
                // All default supported tags and attributes
                "...",
                {
                  tag: "img",
                  attribute: "src",
                  type: "src",
                },
                {
                  tag: "link",
                  attribute: "href",
                  type: "src",
                },
                {
                  tag: "source",
                  attribute: "src",
                  type: "src",
                },
              ],
            },
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
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
        test: /\.png$|\.mp3$/, loader: 'url-loader',
        options: {
          limit: 2048,
          name: '[name]-[hash].[ext]'
        }
      }
    ]
  },
  plugins: getPlugins(),
  output: {
    filename: devMode ? '[name]-[hash].js' : '[name]-[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  }
};

function getPlugins() {
  var plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    }),
    new webpack.ProvidePlugin({
      // $: 'jquery',
      jQuery: 'jquery'
    }),
    new MiniCssExtractPlugin({
      filename: "[name]-[chunkhash].css",
      chunkFilename: "[id]-[chunkhash].css"
    }),
  ];

  return plugins;
}

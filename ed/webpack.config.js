const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: false
        },
        minify: (file, sourceMap) => {
          // https://github.com/mishoo/UglifyJS2#minify-options
          const uglifyJsOptions = {
            mangle: false,
            output: {
              beautify: true,
            },
            parallel: true,
          };

          if (sourceMap) {
            uglifyJsOptions.sourceMap = {
              content: sourceMap,
            };
          }

          return require('uglify-js').minify(file, uglifyJsOptions);
        },
      })
    ]
  },
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
            minimize: false,
          },
        }
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
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
        test: /\.png$|\.mp3$|\.jpg$|\.ico$/, loader: 'url-loader',
        options: {
          limit: 2048,
          name: '[name]-[hash].[ext]'
        }
      },
      /*
      * Necessary to be able to use angular 1 with webpack as explained in https://github.com/webpack/webpack/issues/2049
      */
      {
        test: require.resolve('angular'),
        loader: 'exports-loader?window.angular'
      },
      { test: /angular-[^.]+\.js$/,
        loader: "imports-loader",
        options: {
          imports: [
            {
              moduleName: 'angular',
            },
          ]
        }
      },
      { test: /bootstrap\/[^.]+\.js$/,
        loader: "imports-loader",
        options: {
          type: 'commonjs',
          imports: 'single jquery jQuery',
        },
      },
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
      template: 'app/index.html',
      minify: false,
    }),
    new MiniCssExtractPlugin({
      filename: "[name]-[chunkhash].css",
      chunkFilename: "[id]-[chunkhash].css"
    }),
    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery',
      angular: 'angular',
      THREE: 'three',
      FastClick: 'fastclick',
      API: 'robot-api',
    }),
  ];

  // production specific
  if (process.env.NODE_ENV === 'production') {
    plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }));
    plugins.push(new WebpackShellPlugin({
      onBuildEnd: ['./strip_trailing_spaces.bash']
    }));
  }

  // development specific
  if (devMode) {
    // Only enable hot in development
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return plugins;
}

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'auto-ros',
    'os'
  ],
  configureWebpack: {
    module: {
      rules: [
        {
          // @vue/test-utils bundles js-beautify's UMD wrapper, whose AMD branch
          // references non-existent './lib/beautify*' files. Webpack must not parse it as AMD.
          test: /[\\/]node_modules[\\/]@vue[\\/]test-utils[\\/]/,
          parser: { amd: false }
        }
      ]
    },
    resolve: {
      fallback: {
        'os': require.resolve('os-browserify/browser')
      }
    }
  },
  filenameHashing: false,
  productionSourceMap: false,
  publicPath: './'
})

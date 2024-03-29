const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'auto-ros',
    'os'
  ],
  configureWebpack: {
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

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  chainWebpack: config => {
    config.optimization.set('realContentHash', true)
  },
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
  publicPath: './'
})

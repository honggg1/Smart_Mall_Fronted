const { defineConfig } = require('@vue/cli-service')
const ComponentsPlugin = require('unplugin-vue-components/webpack').default
const { VantResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8086
  },
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()],
      })
    ]
  }
})

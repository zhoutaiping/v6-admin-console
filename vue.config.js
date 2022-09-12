const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = 'Admin' // page title
module.exports = {
  lintOnSave: true,
  // publicPath: './',
  chainWebpack: config => {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(path.resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
  },
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        data: `@import "./src/styles/variables.scss";`
      }
      // less: {
      //   javascriptEnabled: true
      // }
    }
  },
  assetsDir: 'static',
  devServer: {
    // disableHostCheck: true,
    port: 7070,
    proxy: {
      '/api': {
        target: 'http://adminv5.test.nodevops.cn',
        changeOrigin: true
      },
      '/asset/v1': {
        target: 'http://adminv5.test.nodevops.cn',
        changeOrigin: true
      },
      '/tag': {
        target: 'http://adminv5.test.nodevops.cn',
        changeOrigin: true
      },
      '/s_disp': {
        target: 'http://adminv5.test.nodevops.cn',
        changeOrigin: true
      },
      '/agw/oplog': {
        target: 'http://adminv5.test.nodevops.cn',
        changeOrigin: true
      },
      '/gateway': {
        target: 'http://jh27-gateway-api.console.baishan.com',
        changeOrigin: true,
        pathRewrite: {
          '/gateway': ''
        }
      }
    }
  },
  pluginOptions: {
    storybook: {
      allowedPlugins: [
        'define'
      ]
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}

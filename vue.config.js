const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { generateEntries } = require('./mutiple-entry')

const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  publicPath: IS_PROD ? process.env.BASE_URL : '/',
  productionSourceMap: false,
  pages: generateEntries(),
  devServer: {
    open: true
  },
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@buy', resolve('src/pages/buy'))
      .set('@rent', resolve('src/pages/rent'))
      .set('@index', resolve('src/pages/index'))
      .set('@common', resolve('src/components'))

    if (!IS_PROD) {
      config.output
        .filename(bundle => {
          return bundle.chunk.name === 'index' ? 'js/[name].js' : '[name]/[name].js'
        })
    }

    if (IS_PROD) {
      config.output
        .filename(bundle => {
          return bundle.chunk.name === 'index' ? 'js/[name].[contenthash:8].js' : '[name]/[name].[contenthash:8].js'
        })

      config.plugin('extract-css').use(MiniCssExtractPlugin, [
        {
          filename: bundle => {
            return bundle.chunk.name === 'index' ? 'css/[name].[contenthash:8].css' : '[name]/[name].[contenthash:8].css'
          },
          chunkFilename: 'css/[name].[contenthash:8].css'
        }
      ])
    }
  }
}

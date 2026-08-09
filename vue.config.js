const { defineConfig } = require('@vue/cli-service')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const shouldAnalyzeBundle = process.env.ANALYZE === 'true'

module.exports = defineConfig({
  parallel: false,
  // 公共路径
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  // 需要兼容旧浏览器时可设为 true
  transpileDependencies: false,
  lintOnSave: false,
  // 关闭生产环境 source map，缩小产物并加快构建
  productionSourceMap: false,
  devServer: {
    port: 8080,
    open: false,
    proxy: {
      '/': {
        target: 'http://47.121.187.247:5555/',
        changeOrigin: true,
        ws: false,
      }
    }
  },
  configureWebpack: () => {
    const plugins = [
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\\.(js|css|html|svg)$/,
        // 小文件的压缩收益通常不足以抵消构建开销。
        threshold: 10 * 1024,
        minRatio: 0.8,
      }),
    ]

    // 仅在显式设置 ANALYZE=true 时生成分析报告，避免拖慢常规构建。
    if (shouldAnalyzeBundle) {
      plugins.push(new BundleAnalyzerPlugin())
    }

    return {
      plugins,
      resolve: {
        fallback: {
          buffer: require.resolve('buffer/')
        }
      }
    }
  },
})

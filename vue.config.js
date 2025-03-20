const { defineConfig } = require('@vue/cli-service')
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  parallel: false,
  //公共路径
  publicPath: './',
  //输出文件目录
  outputDir: "dist",
  transpileDependencies: false,  // 你希望在旧版本的浏览器上也能正常运行。你可以这样配置 transpileDependencies:true
  lintOnSave: false,  //关闭语法检查
  productionSourceMap: false, // 不需要生产环境的设置false可以减小dist文件大小，加速构建
  devServer: {
    port: 8080,  // 端口（暂定）
    open: false,  //npm run serve后自动打开默认浏览器
    proxy: {
      '/': {
        // target: 'http://127.0.0.1:80/',   // 本地服务器地址
        target: 'http://47.121.187.247:5555/',   // 网络服务器地址
        changeOrigin: true, // 是否跨域
        ws: false, // 是否支持 websocket
        // pathRewrite: { // 可以理解为一个重定向或者重新赋值的功能
        //   '^/api': '/'    // '^/api': '/'    这种接口配置出来     http://127.0.0.1:10001/login
        // }
      }
    }
  },

  configureWebpack: {
    plugins: [
      // 添加 CompressionPlugin 插件实例
      new CompressionWebpackPlugin({
        // filename: '[path][base].gz', // 生成的压缩文件名格式
        algorithm: 'gzip', // 使用 gzip 算法进行压缩
        test: /\.(js|css|html)$/, // 压缩文件的匹配规则
        threshold: 200, // 仅压缩超过指定大小的文件
        minRatio: 0.8, // 仅压缩压缩比超过指定比例的文件
      }),
      // 使用 BundleAnalyzerPlugin 插件
      new BundleAnalyzerPlugin(),
    ],
    resolve: {
      fallback: {
        buffer: require.resolve('buffer/')
      }
    }
  },
}

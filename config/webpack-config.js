const path = require('path');
function pathHandler(params) {
  return path.join(__dirname,params)
}

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: pathHandler('../src/index.js'),
  output: {
    path: pathHandler('../dist')
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js[x]?$/, // 此规则生效与哪种类型的文件
        exclude: /(node_modules|bower_components)/, // 表示规则排除node_modules中的文件
        use: { // use表示你将使用哪一个loader来进行转换
          loader: 'babel-loader',
          options: {
            //预设
            presets: ['@babel/preset-env'] // 用于编译 ES2015+ 语法
          }
        }
      },
      {
        test: /\.css$/i,
        use: [
          // 'vue-style-loader',
          // MiniCssExtractPlugin.loader,
          "style-loader", 
          "css-loader"
        ], // 下标越大越先执行
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          // 'vue-style-loader',
          // MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'my react 计算机',
      filename: 'index.html',
      template: pathHandler('../public/index.html'),
      hash: true, // 防止缓存，会给文件后面加入hash
      inject: 'body',  // js插入的位置true/'head'/'body'/false
      minify: {
        removeAttributeQuotes: true // 压缩 去掉引号
      },
      // favicon: pathHandler('../public/favicon.ico')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
  ],
  devServer: {
    static: pathHandler('./dist'), // 起服务的目录
    compress: true, // 压缩
    port: 7001, // 端口号（默认8080）
    open: true,
  },
  mode: 'development'
}

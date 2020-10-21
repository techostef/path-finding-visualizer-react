const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry: './src/index.js',
   output: {
      path: path.join(__dirname, '/www'),
      // filename: 'index_bundle.js'
      // filename: '[name].[contenthash].js',
      filename: '[name].[hash].js',
   },
   devServer: {
      inline: true,
      port: 8001,
      historyApiFallback: true
   },
   optimization: {
      moduleIds: 'hashed',
      runtimeChunk: 'single',
      splitChunks: {
         cacheGroups: {
            vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            },
         },
      },
   },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['@babel/env', '@babel/react']
            }
         },
         {
            test: /\.(sa|sc|c)ss$/,
            use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"]
         }, {
            test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf)(\?[a-z0-9=.]+)?$/,
            loader: 'url-loader?limit=100000' 
         }, {
            test: /\.svg$/,
            use: ['@svgr/webpack', 'url-loader'],
         }
      ]
   },
   resolve: {
      extensions: ['.js', '.jsx'],
   },
   plugins:[
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
         title: 'Caching',
         template: './public/index.html'
      })
   ]
}
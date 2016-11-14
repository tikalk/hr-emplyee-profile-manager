const webpack = require('webpack');

module.exports = {
  // devtool: 'cheap-module-eval-source-map',
  devtool: 'source-map',
  entry: {
    app: ['webpack/hot/dev-server', './src/js/main.js'],
  },
  target: 'node',
  output: {
    path: './dist',
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/dist/'
  },
  devServer: {
    contentBase: './src',
    publicPath: 'http://localhost:8080/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['transform-decorators-legacy'],
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};

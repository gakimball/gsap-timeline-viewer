const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';

const plugins = [];

if (PRODUCTION) {
  plugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      mangle: false,
    },
  }))
}

module.exports = {
  context: path.resolve(__dirname, 'demo'),
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins,
};

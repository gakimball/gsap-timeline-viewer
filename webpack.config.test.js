const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'test'),
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'test'),
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
  }
};

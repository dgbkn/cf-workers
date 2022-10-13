const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: path.join(__dirname, 'index.js'),
  target: 'webworker',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'worker.js',
  },
  resolve: {
    extensions: [
      '.js',
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
  ],
};

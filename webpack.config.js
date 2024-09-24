const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.ts', // Specify your entry point
  output: {
    filename: 'browser.js', // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve .ts and .js files
    fallback: {
      process: require.resolve('process/browser'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      buffer: require.resolve('buffer'), // Polyfill for `Buffer`
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      fs: require.resolve('browserify-fs'),
      net: false,

      url: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'], // Automatically use the Buffer polyfill
      process: 'process/browser',
      stream: 'stream-browserify',
      path: 'path-browserify',
      os: 'os-browserify/browser',
      fs: 'browserify-fs',
    }),
  ],
  mode: 'development', // Or 'production' for optimized output
};

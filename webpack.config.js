const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.ts', // Specify your entry point
  output: {
    filename: 'index.js', // Output file name
    path: path.resolve(__dirname, 'build'), // Output directory
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve .ts and .js files
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      buffer: require.resolve('buffer'), // Polyfill for `Buffer`
      crypto: require.resolve('crypto-browserify'), // Polyfill for `Buffer`
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      process: require.resolve('process/browser'),
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
    }),
  ],
  mode: 'development', // Or 'production' for optimized output
};

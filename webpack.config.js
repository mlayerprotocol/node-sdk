const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './index.ts', // Specify your entry point
  output: {
    filename: 'browser.js', // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
    library: {
      name: 'mlayer', // This will be the global variable name for UMD builds
      type: 'umd', // Universal Module Definition (UMD) for compatibility with CommonJS, AMD, and global variable
    },
    globalObject: 'this', // This ensures that the library works in both browser and Node.js
    clean: false, // Clean the output directory before every build
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
        use: {
          loader: 'babel-loader', // Transpile modern JavaScript
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'], // Automatically use the Buffer polyfill
      process: 'process/browser.js',
      stream: 'stream-browserify',
      path: 'path-browserify',
      os: 'os-browserify/browser',
      fs: 'browserify-fs',
    }),
  ],
  mode: 'production', // Or 'production' for optimized output
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: {
          condition: 'some', // Extract comments that match certain conditions
          filename: 'OTHER_LICENSES.txt', // The name of the file where the licenses will be extracted
          banner: (licenseFile) => {
            return `For license information, see LICENSE.txt & ${licenseFile}`;
          },
        },
        terserOptions: {
          format: {
            comments: /@license|@preserve|Copyright/i, // You can customize this regex to include/exclude certain comments
          },
        },
      }),
    ],
  },
};

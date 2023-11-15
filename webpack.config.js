const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const devtool = devMode ? 'source-map' : undefined;
const distDir = devMode ? 'build' : 'dist';

module.exports = [
  {
    mode,
    entry: path.resolve(__dirname, 'src', 'electron', 'electron.ts'),
    target: 'electron-main',
    module: {
      rules: [{
        test: /\.ts$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }]
      }]
    },
    output: {
      path: path.resolve(__dirname, distDir),
      filename: 'electron.js',
      clean: true,
    }
  },
  {
    mode,
    entry: path.resolve(__dirname, 'src', 'app', 'index.tsx'),
    target: 'electron-renderer',
    devtool,
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }]
        },
        {
          test: /\.(c|sc|sa)ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ]
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'app', 'index.html'),
        inject: 'body'
      }),
      new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, distDir),
      filename: 'index.[contenthash].js'
    },
  }
];
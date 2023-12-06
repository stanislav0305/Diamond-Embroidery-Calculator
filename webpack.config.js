const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const devtool = devMode ? 'source-map' : undefined;
const distDir = devMode ? 'build' : 'prod';

module.exports = [
  {
    mode,
    entry: [
      path.resolve(__dirname, 'src', 'electron', 'main.ts'),
      path.resolve(__dirname, 'src', 'assets', 'diamond.ico'),
      path.resolve(__dirname, 'src', 'assets', 'license.md')
    ],
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [{ loader: 'ts-loader' }]
        },
        {
          test: /\.md$/i,
          type: 'asset/resource'
        },
        {
          test: /\.ico$/i,
          type: 'asset/resource'
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        "@shared": path.resolve(__dirname, 'src/shared')
      }
    },
    output: {
      path: path.resolve(__dirname, distDir),
      filename: 'main.js',
      assetModuleFilename: 'assets/[name][ext]',
      //clean: true,
    }
  },
  {
    mode,
    entry: [
      path.resolve(__dirname, 'src', 'preload', 'preload.ts')
    ],
    target: 'electron-preload',
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [{ loader: 'ts-loader' }]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        "@shared": path.resolve(__dirname, 'src/shared')
      }
    },
    output: {
      path: path.resolve(__dirname, distDir),
      filename: 'preload.js'
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
          exclude: /node_modules/,
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
        {
          test: /\.(jpe?g|png|webp|gif|svg)$/i,
          type: 'asset/resource',
          use: {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'app', 'index.html'),
        inject: 'body'
      }),
      new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss'],
      alias: {
        "@containers": path.resolve(__dirname, 'src/app/containers'),
        '@components': path.resolve(__dirname, 'src/app/components'),
        "@contexts": path.resolve(__dirname, 'src/app/contexts'),
        "@utils":path.resolve(__dirname, 'src/app/utils'),
        "@hooks": path.resolve(__dirname, 'src/app/utils/hooks'),
        "@shared": path.resolve(__dirname, 'src/shared'),
        "@assets": path.resolve(__dirname, 'src/assets')
      }
    },
    output: {
      path: path.resolve(__dirname, distDir),
      filename: 'index.[contenthash].js',
      assetModuleFilename: 'assets/[name][ext]'
    },
  }
];
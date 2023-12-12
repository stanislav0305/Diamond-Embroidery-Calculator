const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {

  console.log('env.production', env.production);
  console.log('env.development', env.development);
  console.log('env.build_themes', env.build_themes);

  const mode = env.development === true ? 'development' : env.production === true ? 'production' : ''; //process.env.NODE_ENV || 'development';
  const devMode = env.development === true;
  const buildThemes = env.build_themes;

  const distThemesDir = devMode ? 'build-themes' : 'build-themes-prod';
  const devtool = devMode ? 'source-map' : undefined;
  const distDir = devMode ? 'build' : 'prod';

  const config = [];

  if (!buildThemes) {
    const mainConfig = [
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
        entry: {
          index: path.resolve(__dirname, 'src', 'app', 'index.tsx'),
        },
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
            inject: 'body',
            excludeChunks: ['cerulean-theme', 'darkly-theme', 'litera-theme', 'materia-theme',
              'pulse-theme', 'simplex-theme', 'solar-theme', 'united-theme', 'zephyr-theme',
              'cosmo-theme', 'flatly-theme', 'lumen-theme', 'minty-theme', 'quartz-theme',
              'sketchy-theme', 'spacelab-theme', 'vapor-theme', 'cyborg-theme', 'journal-theme',
              'lux-theme', 'morph-theme', 'sandstone-theme', 'slate-theme', 'superhero-theme',
              'yeti-theme']
          }),
          new MiniCssExtractPlugin({ filename: '[name].css' })
        ],
        resolve: {
          extensions: ['.tsx', '.ts', '.js', '.scss'],
          alias: {
            "@containers": path.resolve(__dirname, 'src/app/containers'),
            '@components': path.resolve(__dirname, 'src/app/components'),
            "@contexts": path.resolve(__dirname, 'src/app/contexts'),
            "@utils": path.resolve(__dirname, 'src/app/utils'),
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

    config.push(mainConfig);
  }

  if (buildThemes) {
    const themeConfig = {
      mode,
      entry: {
        'cerulean-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'cerulean.scss'),
        'darkly-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'darkly.scss'),
        'litera-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'litera.scss'),
        'materia-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'materia.scss'),
        'pulse-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'pulse.scss'),
        'simplex-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'simplex.scss'),
        'solar-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'solar.scss'),
        'united-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'united.scss'),
        'zephyr-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'zephyr.scss'),
        'cosmo-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'cosmo.scss'),
        'flatly-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'flatly.scss'),
        'lumen-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'lumen.scss'),
        'minty-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'minty.scss'),
        'quartz-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'quartz.scss'),
        'sketchy-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'sketchy.scss'),
        'spacelab-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'spacelab.scss'),
        'vapor-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'vapor.scss'),
        'cyborg-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'cyborg.scss'),
        'journal-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'journal.scss'),
        'lux-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'lux.scss'),
        'morph-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'morph.scss'),
        'sandstone-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'sandstone.scss'),
        'slate-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'slate.scss'),
        'superhero-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'superhero.scss'),
        'yeti-theme': path.resolve(__dirname, 'src', 'app', 'themes', 'yeti.scss'),
      },
      target: 'electron-renderer',
      devtool,
      module: {
        rules: [
          {
            test: /\.(c|sc|sa)ss$/i,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader',
            ]
          }
        ]
      },
      plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' })
      ],
      resolve: {
        extensions: ['.scss'],
      },
      output: {
        path: path.resolve(__dirname, distThemesDir)
      },
    }

    config.push(themeConfig);
  }

  return config;
};
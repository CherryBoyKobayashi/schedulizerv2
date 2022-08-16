const HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path')

module.exports = {
    mode: 'development',
    entry: "./src/index.js",
    devServer: {
      port: 8080,
      historyApiFallback: true
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-react', '@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime'],
              },
            },
          },
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          },
        ],
      },
      plugins: [
          new HtmlWebpackPlugin({
              template:
                  './public/index.html',
          }),
      ],
      experiments: {
        topLevelAwait: true
      }
  };

// "start": "concurrently --kill-others \"node ../server/index.js\" \"webpack serve\"",
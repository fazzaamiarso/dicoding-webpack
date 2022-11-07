import path from "path";
import webpack from "webpack";
import "webpack-dev-server";

import HtmlWebpackPlugin from "html-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

const config: webpack.Configuration = {
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new ESLintPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(scss|css)$/i,
        exclude: [/\.styles.scss$/],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.styles.scss$/,
        exclude: /node_modules/,
        use: [
          'sass-to-string',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
    ],
  },
};

export default config;

import merge from "webpack-merge";
import webpackCommon from "./webpack.common";
import webpack from "webpack";

const config: webpack.Configuration = merge(webpackCommon, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
});

export default config;

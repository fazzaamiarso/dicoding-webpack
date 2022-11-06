import merge from "webpack-merge";
import webpackCommon from "./webpack.common";
import webpack from "webpack";

const config: webpack.Configuration = merge(webpackCommon, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
});

export default config;

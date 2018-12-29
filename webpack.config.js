const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const env = require("./config/env");

/**
 *
 * TODO
 *
 * > log errors on component rendering
 *
 */

module.exports = {
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index_bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-syntax-dynamic-import"]
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[local]--[hash:base64:5]",
              sourceMap: false
            }
          },
          "sass-loader"
        ]
      },
      { test: /\.(png|jpg|gif)$/, use: [{ loader: "file-loader" }] }
    ]
  },
  devServer: { historyApiFallback: true },
  plugins: [
    new HtmlWebPackPlugin({
      hash: true,
      filename: "index.html",
      template: "./public/index.html"
    }),
    new ExtractTextPlugin({ filename: "css/style.css" }),
    new CopyWebpackPlugin([{ from: "./src/assets", to: "./dist/assets" }]),
    new webpack.DefinePlugin(env)
  ]
};

var path = require("path");
var CopyPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var nodeModulesPath = path.resolve(__dirname, "node_modules");

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "build"),
    host: "localhost",
    port: "3000",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    }
  },
  entry: {
    index: "./src/index.ts"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        loaders: ["babel-loader"],
        exclude: [/node_modules/, nodeModulesPath]
      },
      {
        test: /\.tsx?$/,
        use: [{
          loader: "ts-loader",
          options: {
            // transpileOnly: true
          }
        }],
        exclude: [/node_modules/, nodeModulesPath]
      },
      {
        test: /\.(jsx?)$/,
        loaders: ["babel-loader"],
        exclude: [/node_modules/, nodeModulesPath]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  externals: {},
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([{
      from: 'public',
      to: ''
    }])
  ],
  resolve: {
    modules: ["src", "node_modules"],
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"]
  }
};

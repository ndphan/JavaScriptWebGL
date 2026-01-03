var path = require("path");
var nodeModulesPath = path.resolve(__dirname, "node_modules");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  externals: {},
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/Core/WebGL/Shaders'),
          to: path.resolve(__dirname, 'dist/Core/WebGL/Shaders'),
          filter: (resourcePath) => resourcePath.endsWith('.glsl'),
        },
      ],
    }),
  ],
  performance: {
    hints: false
  },
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".js", ".ts", ".tsx", ".glsl", ".*"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    library: {
      type: "umd",
      name: "SynarenEngine"
    },
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env"
            ],
          ],
        },
        exclude: [/node_modules/, nodeModulesPath],
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: [/node_modules/, nodeModulesPath],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.glsl$/i,
        use: "raw-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env"
            ],
          ],
        },
      }
    ],
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    port: 3030,
    hot: true,
    open: false
  }
};

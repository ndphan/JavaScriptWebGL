var path = require("path");
var nodeModulesPath = path.resolve(__dirname, "node_modules");

module.exports = {
  entry: {
    "javascript-webgl-engine": "./src/index.ts"
  },
  externals: {},
  plugins: [
    
  ],
  performance: {
    hints: false
  },
  resolve: {
    modules: ["src-webgl", "node_modules"],
    extensions: ["*", ".js", ".ts", ".tsx", ".glsl"],
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "[name].js",
    library: "javascript-webgl-engine",
    libraryTarget: "umd",
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
  }
};

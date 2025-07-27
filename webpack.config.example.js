const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'ExampleApp/index.ts'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'index.js',
    library: {
      type: 'umd',
      name: 'ExampleApp',
    },
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'ExampleApp/tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.glsl$/i,
        use: "raw-loader",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public/assets', to: 'assets' },
        { from: 'public/index.html', to: 'index.html' },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
      serveIndex: true,
      watch: true,
    },
    compress: true,
    port: 9000,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.get('*.fnt', (req, res, next) => {
        res.type('text/plain');
        next();
      });
      return middlewares;
    },
  },
  devtool: 'source-map',
};

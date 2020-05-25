const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    popup: path.join(__dirname, "src/ui/index.tsx"),
    background: path.join(__dirname, "src/background.ts"),
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
  },
  plugins: [
    new CopyPlugin([{
        from: "./src/manifest.json",
        to: path.join(__dirname, "dist"),
      },
      {
        from: "./src/popup.html",
        to: path.join(__dirname, "dist"),
      },
      {
        from: "./src/background.html",
        to: path.join(__dirname, "dist"),
      },
      {
        from: "./src/images/logo-32.png",
        to: path.join(__dirname, "dist"),
      },
      {
        from: "./src/images/logo-128.png",
        to: path.join(__dirname, "dist"),
      },
    ]),
    new Dotenv(),
  ],
  module: {
    rules: [{
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [{
            loader: "style-loader" // Creates style nodes from JS strings
          },
          {
            loader: "css-loader" // Translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // Compiles Sass to CSS
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};
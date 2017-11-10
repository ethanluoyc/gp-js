const path = require("path");

module.exports = {
  entry: {
    main: "./src/main.jsx",
    marginal_likelihood: "./src/marginal_likelihood.jsx",
    update_observations: "./src/update_observations.jsx"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist/js")
  },
  devtool: "inline-source-map",
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.jsx$/, loader: "babel-loader", exclude: /node_modules/ }
    ]
  }
};
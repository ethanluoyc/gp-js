const path = require("path");

module.exports = {
  entry: {
    marginal_likelihood: "./src/marginal_likelihood.jsx",
    update_observations: "./src/update_observations.jsx",
    hyperparams: "./src/hyperparams.jsx",
    noise_level: "./src/noise_level.jsx",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist/js"),
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.jsx$/, loader: "babel-loader", exclude: /node_modules/ }
    ]
  }
};
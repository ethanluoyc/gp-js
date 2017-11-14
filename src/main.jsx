import GPApp from "./gpapp.jsx";

const ReactDOM = require("react-dom");
const React = require("react");

ReactDOM.render(
  <GPApp ty="lengthscales" caption="Different length scales"/>,
  document.getElementById("gp-lengthscales")
);

ReactDOM.render(
  <GPApp ty="noise" caption="Different noise"/>,
  document.getElementById("gp-noise")
);


ReactDOM.render(
  <GPApp ty="covariance" caption="Different covariance function"/>,
  document.getElementById("gp-covariance")
);

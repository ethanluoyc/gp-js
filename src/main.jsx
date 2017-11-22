const ReactDOM = require("react-dom");
const React = require("react");
import { GPAddObservationAPP } from "./update_observations.jsx";
import { ContourPlot } from "./marginal_likelihood.jsx";
import { HyperParamsGPApp } from "./hyperparams.jsx";
import { NoiseLevelApp } from "./noise_level.jsx";

ReactDOM.render(<NoiseLevelApp />, document.getElementById("gp-noise-level"));

ReactDOM.render(
  <HyperParamsGPApp ty="lengthscales" caption="Different length scales" />,
  document.getElementById("gp-lengthscales")
);

ReactDOM.render(
  <HyperParamsGPApp ty="noise" caption="Different noise" />,
  document.getElementById("gp-noise")
);

ReactDOM.render(
  <HyperParamsGPApp ty="covariance" caption="Different covariance function" />,
  document.getElementById("gp-covariance")
);

// Contour plot
ReactDOM.render(<ContourPlot />, document.getElementById("app"));

// Update observations
const comp = ReactDOM.render(
  <GPAddObservationAPP />,
  document.getElementById("gp-update-observations")
);

d3.json("/data/dataset.json", data => {
  for (let i = 0; i < data.X.length; i += 1) {
    comp.addTrPoint(data.X[i], data.Y[i]);
  }
});

const ReactDOM = require("react-dom");
const React = require("react");
import { GPAddObservationAPP } from "./update_observations.jsx";
import { ContourPlot } from "./marginal_likelihood.jsx";
import { HyperParamsGPApp } from "./hyperparams.jsx";
import { defaultConfig } from "./gputils.jsx";

const sliderOptGPParam =  { width: 200, height: 9, min: 0.01, max: 10 }; // length-scales
const sliderOptGPNoise =  { width: 200, height: 9, min: 0,    max: 1 }; // noise-variance 
const sliderOptGPSignal = { width: 200, height: 9, min: 0,    max: 1 }; // signal-variance

/** Wraps arbitrary React.Component as a figure 
 * @param {React.Component} WrappedComponent, component class to be wrapped
*/
function DistillFigure(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      const caption = props.caption;
      // delete props.caption;
      super(props);
      this.caption = caption;
    }

    render() {
      return (
        <div>
          <figure>
            <WrappedComponent {...this.props} />
            <figcaption>{this.props.caption}</figcaption>
          </figure>
        </div>
      );
    }
  };
}

// "HyperparamsFigure" only supports three kinds
// of hyperparameters
// 1. lengthscales
// 2. noise
// 3. signal
// pass in as ty to configure them, see below

let HyperparamsFigure = DistillFigure(HyperParamsGPApp);
ReactDOM.render(
  <HyperparamsFigure
    sliderOpt={sliderOptGPParam}
    config={defaultConfig}
    ty="lengthscales"
    caption="Different length scales blah"
  />,
  document.getElementById("gp-lengthscales")
);

ReactDOM.render(
  <HyperparamsFigure
    sliderOpt={sliderOptGPNoise}
    ty="noise"
    config={defaultConfig}
    caption="Different noise"
  />,
  document.getElementById("gp-noise")
);

ReactDOM.render(
  <HyperparamsFigure
    sliderOpt={sliderOptGPSignal}
    config={defaultConfig}
    ty="signal"
    caption="Different signal variance"
  />,
  document.getElementById("gp-signal")
);

ReactDOM.render(
  <HyperparamsFigure
    ty="covariance"
    config={defaultConfig}
    caption="Different covariance function"
  />,
  document.getElementById("gp-covariance")
);

// Update observations
let GPAddObservationFigure = DistillFigure(GPAddObservationAPP);
ReactDOM.render(
  <GPAddObservationFigure 
    sliderOptGPParam={sliderOptGPParam}
    sliderOptGPNoise={sliderOptGPNoise}
    caption="Update observations" />,
  document.getElementById("gp-update-observations")
);

// Contour plot for the marginal likelihood
let ContourFigure = DistillFigure(ContourPlot);

// Configuration for RHS GPAxis of contour plot
// TODO: allow for customization of the contour plot size.
let config = {
  width: 500,
  height: 400,
  margin: 30,
};

ReactDOM.render(
  <ContourFigure 
    config={config}
    caption="Contour plot for marginal likelihood" />,
  document.getElementById("app")
);

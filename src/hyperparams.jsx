import GPApp from "./gpapp.jsx";
import {
  GP,
  GPAxis,
  cfs,
  computeDistanceMatrix,
  recomputeProjections,
  tePointsX
} from "./gputils.jsx";
import Slider from "./slider.jsx";
const ReactDOM = require("react-dom");
const React = require("react");

export class HyperParamsGPApp extends GPApp {
  initialize() {
    const gps = [
      new GP(0, [1, 0.2], 1, [], [], []),
      new GP(0, [1, 0.2], 2, [], [], []),
      new GP(0, [1, 0.2], 3, [], [], [])
    ];

    this.state = {
      GPs: gps,
      newGPParam: 1.0,
      newGPNoise: 0.2,
      newGPcf: 0,
      newGPavailableIDs: [10, 9, 8, 7, 6, 5, 4, 3, 2],
      alfa: 0.3,
      stepSize: 3.14,
      NSteps: 15,
      addTrPoints: false,
      trPointsX: [],
      trPointsY: [],
      dmTr: [],
      dmTeTr: [],
      samplingState: 0, // 0 = stopped, 1 = discrete, 2 = continuous
      oldSamplingState: 0,
      showSamples: true,
      showMeanAndVar: false
    };
  }

  render() {
    const sliderOptAlfa = {width: 200, height: 9, min: 0, max: 1};
    const sliderOptStepSize = {width: 200, height: 9, min: 0, max: 2 * Math.PI};
    const sliderOptNSteps = {width: 200, height: 9, min: 1, max: 100, step: 1};
    const sliderOptGPParam = {width: 200, height: 9, min: 0.01, max: 5};
    const sliderOptGPNoise = {width: 200, height: 9, min: 0, max: 2};
    const delGP = this.delGP;
    const gpoptions = cfs.map(function (c) {
      return (<option key={c.id} value={c.id}>{c.name}</option>);
    });
    var control;
    if (this.props.ty == "lengthscales") {
      control = (
        <div>
          Length scale{" "}
          <Slider
            value={this.state.newGPParam}
            setValue={this.setNewGPParam.bind(this)}
            opt={sliderOptGPParam}
          />
          {this.state.newGPParam.toFixed(2)}
        </div>
      );
    } else if (this.props.ty == "noise") {
      control = (
        <div>
          Noise{" "}
          <Slider
            value={this.state.newGPNoise}
            setValue={this.setNewGPNoise.bind(this)}
            opt={sliderOptGPNoise}
          />{" "}
          {this.state.newGPNoise.toFixed(2)}
        </div>
      );
    } else {
      // fallback to covariance
      control = (
        <div>
          Covariance function{" "}
          <select
            value={this.state.newGPcf}
            onChange={this.setNewGPcf.bind(this)}
          >
            {gpoptions}
          </select>
        </div>
      );
    }

    return (
      <div id="gp">
        <div id="gplist">
          <div id="addgp">
            <div>{control}</div>
            <button onClick={this.toggleSampling.bind(this)}>
              {this.state.samplingState == 0 ? "Start" : "Stop"}
            </button>
          </div>
          <div className="l-screen">
            <figure>
              <GPAxis
                state={this.state}
                addTrPoint={this.addTrPoint.bind(this)}
              />
              <figcaption>{this.props.caption}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    );
  }
}
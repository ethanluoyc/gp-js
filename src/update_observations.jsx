import { GP, tePointsX, computeDistanceMatrix, recomputeProjections } from "./gputils.jsx";
import GPApp from "./gpapp.jsx";
import Slider from "./slider.jsx";

const React = require("react");
const ReactDOM = require("react-dom");

export class GPAddObservationAPP extends GPApp {
  constructor(props) {
    super(props);
    this.initialize();
  }

  initialize() {
    const state = GPApp.getDefaultState();
    state.showMeanAndVar = true;
    this.state = state;
  }

  setNewGPNoise(newVal) {
    const gps = this.state.GPs;
    for (let i = 0; i < gps.length; i++) {
      const gp = gps[i];
      let newTrPointsX = this.state.trPointsX;
      let newTrPointsY = this.state.trPointsY;
      let dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
      let dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
      gps[i] = new GP(gps[i].cf, [gp.params[0], newVal], gp.id, dmTr, dmTeTr, newTrPointsY);
    }
    this.setState({ newGPNoise: newVal, GPs: gps });
  }

  setNewGPParam(newVal) {
    const gps = this.state.GPs;
    for (let i = 0; i < gps.length; i++) {
      const gp = gps[i];

      let newTrPointsX = this.state.trPointsX;
      let newTrPointsY = this.state.trPointsY;
      let dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
      let dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
      // var newGPs = recomputeProjections(this.state.GPs, dmTr, dmTeTr, newTrPointsY);

      gps[i] = new GP(gps[i].cf, [newVal, gp.params[1]], gp.id, dmTr, dmTeTr, newTrPointsY);
    }
    this.setState({ newGPParam: newVal, GPs: gps });
  }

  addTrPoint(x, y) {
    if (x >= -5 && x <= 5 && y >= -3 && y <= 3) { // TODO fix range
      let newTrPointsX = this.state.trPointsX.concat([x]);
      let newTrPointsY = this.state.trPointsY.concat([y]);
      let dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
      let dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
      let newGPs = recomputeProjections(this.state.GPs, dmTr, dmTeTr, newTrPointsY);

      this.setState({
        trPointsX: newTrPointsX,
        trPointsY: newTrPointsY,
        dmTr,
        dmTeTr,
        GPs: newGPs,
      });
    }
  }

  render() {
    let sliderOptGPParam = { 
width: 200, height: 9, min: 0.01, max: 5
 };
    let sliderOptGPNoise = { 
width: 200, height: 9, min: 0, max: 2 
};
    const app = super.render();

    return (
      <div id="gp">
        <div id="gplist">
          <div id="addgp">
            <div>
              <div>Length scale <Slider value={this.state.newGPParam}
                                        setValue={this.setNewGPParam.bind(this)}
                opt={sliderOptGPParam}
              />{this.state.newGPParam.toFixed(2)}
              </div>
              <div>Noise <Slider value={this.state.newGPNoise}
                                 setValue={this.setNewGPNoise.bind(this)}
                opt={sliderOptGPNoise} 
              /> {this.state.newGPNoise.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="l-screen">
            <figure>
              <div id="controls">
                <input type="checkbox"
                  value="toggle"
                  checked={this.state.showMeanAndVar}
                  onChange={this.toggleShowMeanAndVar.bind(this)}
                /> Show mean and credible intervals
                <br />
                <br />
                {this.state.addTrPoints ? <span className="info"> click on the figure to add an observation </span> : ""}
                <button onClick={this.toggleAddTrPoints.bind(this)}>{this.state.addTrPoints ? "done" : "add observations"}</button>
                {this.state.addTrPoints ? <button onClick={this.clearTrPoints.bind(this)}>clear</button> : ""}
              </div>
              {app}
              <figcaption>{this.props.caption}</figcaption>
            </figure>
          </div>
        </div>
      </div>);
  }
}

const comp = ReactDOM.render(
  <GPAddObservationAPP />,
  document.getElementById("gp-update-observations"),
);

d3.json("/data/dataset.json", (data) => {
  for (let i = 0; i < data.X.length; i += 1) {
    comp.addTrPoint(data.X[i], data.Y[i]);
  }
});

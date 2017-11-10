var React = require("react");
var ReactDOM = require("react-dom");
import {GP, tePointsX, cfs,
  computeDistanceMatrix, recomputeProjections} from "./gputils.jsx";
import GPApp from "./gpapp.jsx";
import Slider from "./slider.jsx";

class GPAddObservationAPP extends GPApp {
  constructor(props) {
    super(props);
  }

  setNewGPNoise(newVal) {
    let gps = this.state.GPs;
    for (var i = 0; i < gps.length; i++) {
      const gp = gps[i];
      var newTrPointsX = this.state.trPointsX;
      var newTrPointsY = this.state.trPointsY;
      var dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
      var dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
      gps[i] = new GP(gps[i].cf, [gp.params[0], newVal], gp.id, dmTr, dmTeTr, newTrPointsY);
    }
    this.setState({newGPNoise: newVal, GPs: gps});
  }

  setNewGPParam(newVal) {
    let gps = this.state.GPs;
    for (var i = 0; i < gps.length; i++) {
      const gp = gps[i];

      var newTrPointsX = this.state.trPointsX;
      var newTrPointsY = this.state.trPointsY;
      var dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
      var dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
      // var newGPs = recomputeProjections(this.state.GPs, dmTr, dmTeTr, newTrPointsY);

      gps[i] = new GP(gps[i].cf, [newVal, gp.params[1]], gp.id, dmTr, dmTeTr, newTrPointsY);

    }
    this.setState({newGPParam: newVal, GPs: gps});
  }

  addTrPoint(x, y) {
    if (x >= -5 && x <= 5 && y >= -3 && y <= 3) { // TODO fix range
      var newTrPointsX = this.state.trPointsX.concat([x]);
      var newTrPointsY = this.state.trPointsY.concat([y]);
      var dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
      var dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
      var newGPs = recomputeProjections(this.state.GPs, dmTr, dmTeTr, newTrPointsY);

      this.setState({
        trPointsX: newTrPointsX, 
        trPointsY: newTrPointsY,
        dmTr: dmTr,
        dmTeTr: dmTeTr,
        GPs: newGPs
      });
    }
  }

  render() {
    var sliderOptGPParam = {width: 200, height: 9, min: 0.01, max: 5};
    var sliderOptGPNoise = {width: 200, height: 9, min: 0, max: 2};
    const app = super.render();
    
    return(
      <div id="gp">
        <div id="gplist">
          <div id="addgp">
            <div>
              <div>Length scale <Slider value={this.state.newGPParam} setValue={this.setNewGPParam.bind(this)}
                opt={sliderOptGPParam}/>{this.state.newGPParam.toFixed(2)}
              </div>
              <div>Noise <Slider value={this.state.newGPNoise} setValue={this.setNewGPNoise.bind(this)}
                opt={sliderOptGPNoise}/> {this.state.newGPNoise.toFixed(2)}</div>
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
                <br/>
                <br/>
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
  <GPAddObservationAPP/>,
  document.getElementById("gp")
);

d3.json("/data/dataset.json", function(data) {
  var X = data.X;
  var Y = data.Y;
  for (var i = 0; i < X.length; ++i) {
    comp.addTrPoint(X[i], Y[i]);
  }
});

var React = require("react");
var ReactDOM = require("react-dom");
import {GP, tePointsX,
  computeDistanceMatrix, recomputeProjections} from "./gputils.jsx";
import GPApp from "./gpapp.jsx";

class GPAddObservationAPP extends GPApp {
  constructor(props) {
    super(props);
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

}

const comp = ReactDOM.render(
  <GPAddObservationAPP ty="lengthscales" caption="Different covariance function"/>,
  document.getElementById("gp")
);

d3.json("/data/dataset.json", function(data) {
  var X = data.X;
  var Y = data.Y;
  for (var i = 0; i < X.length; ++i) {
    comp.addTrPoint(X[i], Y[i]);
  }
});

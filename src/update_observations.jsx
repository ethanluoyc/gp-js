var React = require("react");
var ReactDOM = require("react-dom");
import {GP, GPAxis, tePointsX,
  computeDistanceMatrix, recomputeProjections} from "./gputils.jsx";
import GPApp from "./gpapp.jsx";

class GPAddObservationAPP extends GPApp {
  constructor(props) {
    super(props);
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


ReactDOM.render(
  <GPAddObservationAPP ty="covariance" caption="Different covariance function"/>,
  document.getElementById("gp")
);

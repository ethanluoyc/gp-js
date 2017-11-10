var React = require("react");
var ReactDOM = require("react-dom");
import { GP, GPAxis } from "./gputils.jsx";
import GPApp from "./gpapp.jsx";
import {tePointsX,
  computeDistanceMatrix, recomputeProjections} from "./gputils.jsx";
import Slider from "./slider.jsx";

var n = 100,
   m = 100,
  padding = 30;

var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

width = 400;
height = 400;

var thresholds = d3.range(1, 21)
  .map(function (p) { return Math.pow(2, p); });

var contours = d3.contours()
  .size([100, 100])
  .thresholds(numeric.linspace(1.2126317839226641 * 1.0001, 2.4, 20));

var color = d3.scaleLinear()
  .domain([0, 5])
  .interpolate(function () { return d3.interpolateYlGnBu; });

d3.json("/data/grid.json", function (error, data) {
  if (error) throw error;
  var dt = new Array(100 * 100);
  for (var i = 0; i < 100; ++i) {
    for (var j = 0; j < 100; ++j) {
      dt[i * 100 + j] = Math.abs(data[i][j]);
    }
  }

  var x = d3.scaleLinear()
      .domain([-2, 6])
      .rangeRound([0, width]),
    y = d3.scaleLinear()
      .domain([-2, 1])
      .rangeRound([height, 0]);

  var xAxis = d3.axisBottom(x).ticks(10);
  var yAxis = d3.axisLeft(y).ticks(10);


  function mousemove(d) {
    var position = d3.mouse(this);
  }

  svg.append("g")
    .attr("transform", "translate(30, 0)")
    .selectAll("path")
    .data(contours(dt))
    .enter().append("path")
    .attr("d", d3.geoPath(d3.geoIdentity().scale(width / n)))
    .attr("fill", function (d) { return color(d.value); })
    .on("click", mousemove);

  svg.append("g")
    .attr("class", "axis axis-y")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);

  svg.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", "translate(30," + height + ")")
    .call(xAxis);

});

class GPMarginalLikelihoodApp extends GPApp {
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
                />
            Show mean and credible intervals
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
  <GPMarginalLikelihoodApp/>,
  document.getElementById("gp")
);

d3.json("/data/dataset.json", function(data) {
  var X = data.X;
  var Y = data.Y;
  for (var i = 0; i < X.length; ++i) {
    comp.addTrPoint(X[i], Y[i]);
  }
});
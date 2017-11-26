import {
  GP,
  GPAxis,
  tePointsX,
  computeDistanceMatrix,
  recomputeProjections,
  defaultConfig
} from "./gputils.jsx";
import GPApp from "./gpapp.jsx";
import Slider from "./slider.jsx";

const React = require("react");
const ReactDOM = require("react-dom");

export class ContourPlot extends React.Component {
  constructor() {
    super();
    this.state = {
      lengthscale: 1,
      noise: 1,
      signal: 1
    };
  }

  componentDidMount() {
    const margin = 40;
    const width = 400;
    const height = 400;

    const svg = d3.select(this.svg)
      .attr("width",  width + 2 * margin)
      .attr("height", height + margin);

    d3.json("/data/dataset_contour.json", (error, dataset) => {
      this.dataset = dataset;
      let data = dataset["LL"];
      const gridSize = dataset["LL"].length;
      let llMax = -1.2207148089884097;
      let llMin = -2.5;

      if (error) throw error;
      const dt = new Array(gridSize * gridSize);
      for (let i = 0; i < gridSize; i += 1) {
        for (let j = 0; j < gridSize; j += 1) {
          dt[i * gridSize + j] = data[i][j];
        }
      }

      const threshold = numeric.linspace(
        llMax * 1.0001,
        llMin,
        20
      );
      threshold.push(-6000);

      const contours = d3
        .contours()
        .size([gridSize, gridSize])
        .thresholds(threshold);

      // https://github.com/d3/d3-scale-chromatic
      const color = d3
        .scaleLinear()
        .domain([llMax, llMin])
        .interpolate(() => i => d3.interpolateSpectral(1 - i));

      const colorbar = d3.colorbarV(color, 20, 100);
      colorbar.tickValues([llMax, (llMax + llMin) / 2, llMin]); // TODO fix negativity

      const x = d3
        .scaleLinear()
        .domain([-5, 1])
        .rangeRound([0, width]);

      const y = d3
        .scaleLinear()
        .domain([-2, 4])
        .rangeRound([height, 0]);

      const xAxis = d3.axisBottom(x).ticks(10); // log-noise
      const yAxis = d3.axisLeft(y).ticks(10); // log-length-scales

      svg
        .append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .selectAll("path")
        .data(contours(dt))
        .enter()
        .append("path")
        .attr("d", d3.geoPath(d3.geoIdentity().scale(width / gridSize)
          .translate([0, height])
          .reflectY(true)))
        .attr("fill", d => color(d.value));

      svg
        .append("g")
        .attr("class", "axis axis-y")
        .attr("transform", `translate(${margin}, 0)`)
        .call(yAxis);

      svg
        .append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(${margin}, ${height})`)
        .call(xAxis);

      this.circle = svg
        .append("g")
        .attr("transform", "translate(100, 100)");

      this.circle
        .append("ellipse")
        .attr("fill-opacity", 0)
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("rx", 10)
        .attr("ry", 10);

      // x axis label
      svg
        .append("text")
        .attr(
          "transform",
          `translate(${width / 2 + margin}, ${height + margin - 10})`
        )
        .style("text-anchor", "middle")
        .text("log-noise");

      // y axis label
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("log-length-scale");

      svg
        .append("g")
        .attr("transform", `translate(${width - 15}, 5)`)
        .call(colorbar);

      this.ll = svg
        .append("text")
        .attr("transform", `translate(${margin + 20}, 20)`)
        .text(`lengthscale: ${this.state.lengthscale.toFixed(3)}`);

      this.ln = svg
        .append("text")
        .attr("transform", `translate(${margin + 20}, 40)`)
        .text(`noise: ${this.state.noise.toFixed(3)}`);

      var that = this;
      function mousemove() {
        const position = d3.mouse(this);
        let pixelsPerGrid = 20;
        let bucketX = d3.min([Math.round((position[0] - margin) / pixelsPerGrid), gridSize - 1]);
        let bucketY = d3.min([Math.round(position[1] / pixelsPerGrid), gridSize - 1]);
        let posX = bucketX * pixelsPerGrid + margin;
        let posY = bucketY * pixelsPerGrid;
        let sigvar = dataset["sig_var"][bucketX][bucketY];

        that.circle.attr("transform", `translate(${posX}, ${posY})`);
        let log_noise = x.invert(posX - margin);
        let log_lengthscale = y.invert(posY);

        that.setState({
          // TODO remove "log" in the names
          noise: Math.exp(log_noise),
          lengthscale: Math.exp(log_lengthscale),
          signal: sigvar
        });
      }

      svg.on("click", mousemove);
    });
  }

  componentWillUpdate(nextProps, nextState) {
    this.ll.text(`lengthscale: ${nextState.lengthscale.toFixed(3)}`);
    this.ln.text(`noise: ${nextState.noise.toFixed(3)}`);
  }

  render() {
    return (
      <div
        style={{
          height: this.props.config.height + 40
        }}
      >
        <div id="gp-contour" style={{ position: "absolute" }}>
          <svg id="contour" ref={svg => this.svg = svg }/>
        </div>
        <div
          id="gp-marginal-likelihood"
          style={{
            position: "absolute",
            left: 450,
            margin: "0px"
          }}>
          <GPMarginalLikelihoodApp
            config={this.props.config}
            noise={this.state.noise}
            lengthscale={this.state.lengthscale}
            signal={this.state.signal}
          />
        </div>
      </div>
    );
  }
}

class GPMarginalLikelihoodApp extends GPApp {
  constructor(props) {
    super(props);
    this.initialize();
  }

  initialize() {
    const state = GPApp.getDefaultState();
    state.showMeanAndVar = true;
    this.state = state;
  }

  componentDidMount() {
    d3.json("/data/dataset_contour.json", data => {
      for (let i = 0; i < data.X.length; i += 1) {
        this.addTrPoint(data.X[i], data.Y[i]);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setNewGPParam(nextProps.lengthscale);
    this.setNewGPNoise(nextProps.noise);
    this.setNewGPSignalVariance(nextProps.signal);
  }

  setNewGPNoise(newVal) {
    const gps = this.state.GPs;
    for (let i = 0; i < gps.length; i += 1) {
      const gp = gps[i];
      const newTrPointsX = this.state.trPointsX;
      const newTrPointsY = this.state.trPointsY;
      const dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
      const dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
      gps[i] = new GP(
        gps[i].cf,
        [gp.params[0], newVal, gp.params[2]],
        gp.id,
        dmTr,
        dmTeTr,
        newTrPointsY
      );
    }
    this.setState({ newGPNoise: newVal, GPs: gps });
  }

  setNewGPParam(newVal) {
    const gps = this.state.GPs;
    for (let i = 0; i < gps.length; i += 1) {
      const gp = gps[i];

      const newTrPointsX = this.state.trPointsX;
      const newTrPointsY = this.state.trPointsY;
      const dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
      const dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
      // var newGPs = recomputeProjections(this.state.GPs, dmTr, dmTeTr, newTrPointsY);

      gps[i] = new GP(
        gps[i].cf,
        [newVal, gp.params[1], gp.params[2]],
        gp.id,
        dmTr,
        dmTeTr,
        newTrPointsY
      );
    }
    this.setState({ newGPParam: newVal, GPs: gps });
  }

  setNewGPSignalVariance(newVal) {
    const newTrPointsX = this.state.trPointsX;
    const newTrPointsY = this.state.trPointsY;
    const dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
    const dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
    let gps = this.state.GPs;
    for (var i = 0; i < gps.length; i++) {
      const gp = gps[i];
      gps[i] = new GP(
        gps[i].cf,
        [gp.params[0], gp.params[1], newVal],
        gp.id,
        dmTr,
        dmTeTr,
        newTrPointsY
      );
    }
    this.setState({ newGPSignalVariance: newVal, GPs: gps });
  }

  addTrPoint(x, y) {
    if (x >= -5 && x <= 5 && y >= -3 && y <= 3) {
      // TODO fix range
      const newTrPointsX = this.state.trPointsX.concat([x]);
      const newTrPointsY = this.state.trPointsY.concat([y]);
      const dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
      const dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
      const newGPs = recomputeProjections(
        this.state.GPs,
        dmTr,
        dmTeTr,
        newTrPointsY
      );

      this.setState({
        trPointsX: newTrPointsX,
        trPointsY: newTrPointsY,
        dmTr,
        dmTeTr,
        GPs: newGPs
      });
    }
  }

  render() {
    const app = (
      <GPAxis
        state={this.state}
        config={this.props.config}
        addNoise={false}
        addTrPoint={this.addTrPoint.bind(this)}
      />
    );

    return <div className="gp-axis">{app}</div>;
  }
}

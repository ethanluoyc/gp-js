import {
  GP,
  GPAxis,
  tePointsX,
  computeDistanceMatrix,
  recomputeProjections
} from "./gputils.jsx";
import GPApp from "./gpapp.jsx";
import Slider from "./slider.jsx";

const React = require("react");
const ReactDOM = require("react-dom");

class ContourPlot extends React.Component {
  constructor() {
    super();
    this.state = {
      log_lengthscale: 0,
      log_noise: 0
    };
  }

  componentDidMount() {
    const n = 100;
    const margin = 40;
    const width = 400;
    const height = 400;

    const svg = d3
      .select("#contour")
      .attr("width", width + 2 * margin)
      .attr("height", height + margin);

    const contours = d3
      .contours()
      .size([100, 100])
      .thresholds(numeric.linspace(1.2126317839226641 * 1.0001, 2.4, 20));

    // https://github.com/d3/d3-scale-chromatic
    const color = d3
      .scaleLinear()
      .domain([1.2126317839226641, 2.4])
      .interpolate(() => d3.interpolateSpectral);

    const colorbar = d3.colorbarV(color, 20, 100);
    colorbar.tickValues([1.2126317839226641, 1.8, 2.4]); // TODO fix negativity

    const x = d3
      .scaleLinear()
      .domain([-2, 1])
      .rangeRound([0, width]);

    const y = d3
      .scaleLinear()
      .domain([-2, 6])
      .rangeRound([0, height]);

    const xAxis = d3.axisBottom(x).ticks(10);
    const yAxis = d3.axisLeft(y).ticks(10);

    let circle = null;

    d3.json("/data/grid.json", (error, data) => {
      if (error) throw error;
      const dt = new Array(100 * 100);
      for (let i = 0; i < 100; i += 1) {
        for (let j = 0; j < 100; j += 1) {
          dt[i * 100 + j] = Math.abs(data[i][j]);
        }
      }

      svg
        .append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .selectAll("path")
        .data(contours(dt))
        .enter()
        .append("path")
        .attr("d", d3.geoPath(d3.geoIdentity().scale(width / n)))
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

      // Draw the Ellipse
      circle = svg.append("g").attr("transform", "translate(100, 100)");

      circle
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

      this.ll = svg.append("text")
        .attr("transform", `translate(${margin + 20}, 20)`)
        .text(`log-lengthscale: ${this.state.log_lengthscale.toFixed(3)}`);
      
      this.ln = svg.append("text")
        .attr("transform", `translate(${margin + 20}, 40)`)
        .text(`log-noise: ${this.state.log_noise.toFixed(3)}`);

      var that = this;
      function mousemove() {
        const position = d3.mouse(this);
        console.log(`log-noise ${x.invert(position[0] - margin)}`);
        console.log(`log-lengthscale ${y.invert(position[1])}`);
        circle.attr("transform", `translate(${position[0]}, ${position[1]})`);
        that.setState({
          // TODO remove "log" in the names
          log_noise: Math.exp(x.invert(position[0] - margin)),
          log_lengthscale: Math.exp(y.invert(position[1]))
        });
      }

      svg.on("click", mousemove);
    });
  }

  componentWillUpdate(nextProps, nextState) {
    this.ll.text(`log-lengthscale: ${nextState.log_lengthscale.toFixed(3)}`);
    this.ln.text(`log-noise: ${nextState.log_noise.toFixed(3)}`);
  }

  render() {
    return (
      <div>
        <div id="gp-contour" style={{position: "absolute"}}><svg id="contour" /></div>
        <div id="gp-marginal-likelihood" style={{position: "absolute",
          left: "550px", 
          margin: "0px"}} >
          <GPMarginalLikelihoodApp
            log_noise={this.state.log_noise}
            log_lengthscale={this.state.log_lengthscale} />
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
    d3.json("/data/dataset.json", data => {
      for (let i = 0; i < data.X.length; i += 1) {
        this.addTrPoint(data.X[i], data.Y[i]);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setNewGPParam(nextProps.log_lengthscale);
    this.setNewGPNoise(nextProps.log_noise);
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
        [gp.params[0], newVal],
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
        [newVal, gp.params[1]],
        gp.id,
        dmTr,
        dmTeTr,
        newTrPointsY
      );
    }
    this.setState({ newGPParam: newVal, GPs: gps });
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
    const sliderOptGPParam = {
      width: 200,
      height: 9,
      min: -2,
      max: 6
    };
    const sliderOptGPNoise = {
      width: 200,
      height: 9,
      min: -2,
      max: 1
    };
    const app = super.render();

    return (
      <div>
        <div className="control">
          <div>
            <div>
              Length scale{" "}
              <Slider
                value={this.state.newGPParam}
                setValue={this.setNewGPParam.bind(this)}
                opt={sliderOptGPParam}
              />
              {this.state.newGPParam.toFixed(2)}
            </div>
            <div>
              Noise{" "}
              <Slider
                value={this.state.newGPNoise}
                setValue={this.setNewGPNoise.bind(this)}
                opt={sliderOptGPNoise}
              />{" "}
              {this.state.newGPNoise.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="gp-axis">{app}</div>
      </div>
    );
  }
}

ReactDOM.render(<ContourPlot />, document.getElementById("app"));

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
      lengthscale: NaN,
      noise: NaN,
      signal: NaN,
      likelihood: NaN,
      gp: new GP(0, [1, 0.2, 1], 1, [], [], []),
      X: null,
      Y: null
    };
  }

  componentDidMount() {
    const margin = 40;
    const width = 400;
    const height = 400;

    const svg = d3
      .select(this.svg)
      .attr("width", width + 2 * margin + 60)
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

      const threshold = numeric.linspace(llMax * 1.0001, llMin, 50);
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
        .attr(
          "d",
          d3.geoPath(
            d3
              .geoIdentity()
              .scale(width / gridSize)
              .translate([0, height])
              .reflectY(true)
          )
        )
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

      this.circle = svg.append("g").attr("transform", "translate(100, 100)");

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
        .attr("transform", `translate(${width + 60}, 5)`)
        .call(colorbar);

      this.circle
        .append("ellipse")
        .attr("fill-opacity", 0)
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("rx", 10)
        .attr("ry", 10);

      let initialX = 50;
      let initialY = 50;
      let pixelsPerGrid = Math.round(width / gridSize);
      let posX = initialX * pixelsPerGrid + margin;
      let posY = initialY * pixelsPerGrid;

      this.circle.attr("transform", `translate(${posX}, ${posY})`);
      let noise = Math.exp(dataset["log_lik_std"][initialX]);
      let lengthscale = Math.exp(
        dataset["log_length_scales"][gridSize - 1 - initialY]
      );
      let sigvar = dataset["sig_var"][gridSize - 1 - initialY][initialX];
      let likelihood = dataset["LL"][gridSize - 1 - initialY][initialX];

      this.ll = svg
        .append("text")
        .attr("transform", `translate(${margin + 20}, 20)`)
        .text(`lengthscale: ${lengthscale.toFixed(3)}`);

      this.ln = svg
        .append("text")
        .attr("transform", `translate(${margin + 20}, 40)`)
        .text(`noise: ${noise.toFixed(3)}`);

      this.likelihood = svg
        .append("text")
        .attr("transform", `translate(${margin + 20}, 60)`)
        .text(`log-likelihood: ${likelihood.toFixed(3)}`);

      this.setState({ X: dataset["X"], Y: dataset["Y"],
        lengthscale: lengthscale,
        noise: noise,
        signal: sigvar,
        likelihood: likelihood
      });
      
      this.setNewGPParams([lengthscale, noise, sigvar]);

      var that = this;
      function mousemove() {
        const position = d3.mouse(this);
        let pixelsPerGrid = Math.round(width / gridSize);
        let bucketX = d3.min([
          Math.round((position[0] - margin) / pixelsPerGrid),
          gridSize - 1
        ]);
        let bucketY = d3.min([
          Math.round(position[1] / pixelsPerGrid),
          gridSize - 1
        ]);
        let posX = bucketX * pixelsPerGrid + margin;
        let posY = bucketY * pixelsPerGrid;
        let sigvar = dataset["sig_var"][gridSize - 1 - bucketY][bucketX];

        that.circle.attr("transform", `translate(${posX}, ${posY})`);
        let log_noise = dataset["log_lik_std"][bucketX];
        let log_lengthscale =
          dataset["log_length_scales"][gridSize - 1 - bucketY];
        // console.log(`sigvar: ${sigvar}, log_noise: ${log_noise}, log_lengthscales: ${log_lengthscale}`);
        // console.log(dataset["LL"][gridSize-1-bucketY][bucketX]);

        that.setState({
          likelihood: dataset["LL"][gridSize - 1 - bucketY][bucketX]
        });

        that.setNewGPParams([
          Math.exp(log_lengthscale),
          Math.exp(log_noise),
          sigvar
        ]);
      }

      svg.on("click", mousemove);
    });
  }

  setNewGPParams(params) {
    const gp = this.state.gp;
    const newTrPointsX = this.state.X;
    const newTrPointsY = this.state.Y;
    const dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
    const dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
    const newGP = new GP(gp.cf, params, gp.id, dmTr, dmTeTr, newTrPointsY);
    this.setState({ gp: newGP,
      lengthscale: params[0],
      noise: params[1],
      signal: params[2],
    });
  }

  componentWillUpdate(nextProps, nextState) {
    this.ll.text(`lengthscale: ${nextState.lengthscale.toFixed(3)}`);
    this.ln.text(`noise: ${nextState.noise.toFixed(3)}`);
    this.likelihood.text(`log-likelihood: ${nextState.likelihood.toFixed(3)}`);
  }

  render() {
    return (
      <div
        style={{
          height: this.props.config.height + 40
        }}
      >
        <div id="gp-contour" style={{ position: "absolute" }}>
          <svg id="contour" ref={svg => (this.svg = svg)} />
        </div>
        <div
          id="gp-marginal-likelihood"
          style={{
            position: "absolute",
            left: 500,
            margin: "0px"
          }}
        >
          <Axis
            config={this.props.config}
            X={this.state.X}
            Y={this.state.Y}
            gp={this.state.gp}
          />
        </div>
      </div>
    );
  }
}

export class Axis extends React.Component {
  constructor(props) {
    super(props);
    this.scales = { x: null, y: null };
  }

  render() {
    return <svg />;
  }

  shouldComponentUpdate() {
    return false;
  }

  drawTrPoints(pointsX, pointsY) {
    const {x, y} = this.scales;
    var p = this.trPoints
      .selectAll("circle.trpoints")
      .data(d3.zip(pointsX, pointsY))
      .attr("cx", function(d) {
        return x(d[0]);
      })
      .attr("cy", function(d) {
        return y(d[1]);
      });
    p
      .enter()
      .append("circle")
      .attr("class", "trpoints")
      .attr("r", 2)
      .attr("cx", function(d) {
        return x(d[0]);
      })
      .attr("cy", function(d) {
        return y(d[1]);
      });
    p.exit().remove();
  }

  componentWillReceiveProps(props) {
    // redraw training points
    if (props.X !== undefined) {
      this.drawTrPoints(props.X, props.Y);
    }
    // redraw mean and variance if necessary
    this.drawMeanAndVar(props);
  }

  drawMeanAndVar(props) {
    var gpline = this.gpline;
    var area = this.area;
    let gps = [props.gp];

    let paths = this.meanLines
      .selectAll("path")
      .data(gps, function(d) {
        return d.id;
      })
      .attr("d", function(d) {
        var datay = d.mu;
        return gpline(d3.zip(tePointsX, datay));
      });
    paths
      .enter()
      .append("path")
      .attr("d", function(d) {
        var datay = d.mu;
        return gpline(d3.zip(tePointsX, datay));
      })
      .attr("class", function(d) {
        return "muline line line" + d.id;
      });
    paths.exit().remove();

    let areas = this.areas
      .selectAll("path")
      .data(gps, function(d) {
        return d.id;
      })
      .attr("d", function(d) {
        let upper = numeric.add(d.mu, d.sd95);
        let lower = numeric.sub(d.mu, d.sd95);
        return area(d3.zip(tePointsX, upper, lower));
      });

    areas
      .enter()
      .append("path")
      .attr("d", function(d) {
        var upper = numeric.add(d.mu, d.sd95);
        var lower = numeric.sub(d.mu, d.sd95);
        return area(d3.zip(tePointsX, upper, lower));
      })
      .attr("class", function(d) {
        return "variance variance" + d.id;
      });
    areas.exit().remove();
  }

  componentDidMount() {
    var svg = d3.select(ReactDOM.findDOMNode(this));
    const config = this.props.config;
    const height = config.height;
    const width = config.width;
    const margin = config.margin;

    svg.attr("height", height).attr("width", width);
    svg = svg.append("g").attr("transform", `translate(${margin}, ${margin})`);

    this.svg = svg;
    let fig_height = height - 2 * margin;
    let fig_width = width - 2 * margin;

    // helper functions
    var x = d3
      .scaleLinear()
      .range([0, fig_width])
      .domain([-5, 5]);
    var y = d3
      .scaleLinear()
      .range([fig_height, 0])
      .domain([-3, 3]);
    this.scales.x = x;
    this.scales.y = y;
    var xAxis = d3
      .axisBottom()
      .scale(x)
      .ticks(5);
    var yAxis = d3
      .axisLeft()
      .scale(y)
      .ticks(5);
    this.gpline = d3
      .line()
      .x(function(d) {
        return x(d[0]);
      })
      .y(function(d) {
        return y(d[1]);
      });

    this.area = d3
      .area()
      .x(function(d) {
        return x(d[0]);
      })
      .y0(function(d) {
        return y(d[1]);
      })
      .y1(function(d) {
        return y(d[2]);
      });

    // axes
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + fig_height + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);

    this.meanLines = svg.append("g");
    this.lines = svg.append("g");
    this.trPoints = svg.append("g");
    this.valuelines = svg.append("g");
    this.areas = svg.append("g");
    // this.drawTrPoints(this.props.state.trPointsX, this.props.state.trPointsY);
  }
}

// class GPMarginalLikelihoodApp extends GPApp {
//   constructor(props) {
//     super(props);
//     this.initialize();
//   }

//   initialize() {
//     const state = GPApp.getDefaultState();
//     state.showMeanAndVar = true;
//     this.state = state;
//   }

//   componentDidMount() {
//     d3.json("/data/dataset_contour.json", data => {
//       for (let i = 0; i < data.X.length; i += 1) {
//         this.addTrPoint(data.X[i], data.Y[i]);
//       }
//     });
//   }

//   componentWillReceiveProps(nextProps) {
//     this.setNewGPParam(nextProps.lengthscale);
//     this.setNewGPNoise(nextProps.noise);
//     this.setNewGPSignalVariance(nextProps.signal);
//   }

//   setNewGPNoise(newVal) {
//     const gps = this.state.GPs;
//     for (let i = 0; i < gps.length; i += 1) {
//       const gp = gps[i];
//       const newTrPointsX = this.state.trPointsX;
//       const newTrPointsY = this.state.trPointsY;
//       const dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
//       const dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
//       gps[i] = new GP(
//         gps[i].cf,
//         [gp.params[0], newVal, gp.params[2]],
//         gp.id,
//         dmTr,
//         dmTeTr,
//         newTrPointsY
//       );
//     }
//     this.setState({ newGPNoise: newVal, GPs: gps });
//   }

//   setNewGPParam(newVal) {
//     const gps = this.state.GPs;
//     for (let i = 0; i < gps.length; i += 1) {
//       const gp = gps[i];

//       const newTrPointsX = this.state.trPointsX;
//       const newTrPointsY = this.state.trPointsY;
//       const dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
//       const dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
//       // var newGPs = recomputeProjections(this.state.GPs, dmTr, dmTeTr, newTrPointsY);

//       gps[i] = new GP(
//         gps[i].cf,
//         [newVal, gp.params[1], gp.params[2]],
//         gp.id,
//         dmTr,
//         dmTeTr,
//         newTrPointsY
//       );
//     }
//     this.setState({ newGPParam: newVal, GPs: gps });
//   }

//   setNewGPSignalVariance(newVal) {
//     const newTrPointsX = this.state.trPointsX;
//     const newTrPointsY = this.state.trPointsY;
//     const dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
//     const dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
//     let gps = this.state.GPs;
//     for (var i = 0; i < gps.length; i++) {
//       const gp = gps[i];
//       gps[i] = new GP(
//         gps[i].cf,
//         [gp.params[0], gp.params[1], newVal],
//         gp.id,
//         dmTr,
//         dmTeTr,
//         newTrPointsY
//       );
//     }
//     this.setState({ newGPSignalVariance: newVal, GPs: gps });
//   }

//   addTrPoint(x, y) {
//     if (x >= -5 && x <= 5 && y >= -3 && y <= 3) {
//       // TODO fix range
//       const newTrPointsX = this.state.trPointsX.concat([x]);
//       const newTrPointsY = this.state.trPointsY.concat([y]);
//       const dmTr = computeDistanceMatrix(newTrPointsX, newTrPointsX);
//       const dmTeTr = computeDistanceMatrix(tePointsX, newTrPointsX);
//       const newGPs = recomputeProjections(
//         this.state.GPs,
//         dmTr,
//         dmTeTr,
//         newTrPointsY
//       );

//       this.setState({
//         trPointsX: newTrPointsX,
//         trPointsY: newTrPointsY,
//         dmTr,
//         dmTeTr,
//         GPs: newGPs
//       });
//     }
//   }

//   render() {
//     const app = (
//       <GPAxis
//         state={this.state}
//         config={this.props.config}
//         addNoise={false}
//         addTrPoint={this.addTrPoint.bind(this)}
//       />
//     );

//     return <div className="gp-axis">{app}</div>;
//   }
// }

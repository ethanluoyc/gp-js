import {
  GP,
  GPAxis,
  cfs,
  computeDistanceMatrix,
  recomputeProjections,
  tePointsX,
} from "./gputils.jsx";

import Slider from "./slider.jsx";
const React = require("react");
const ReactDOM = require("react-dom");

function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

export class HyperParamsGPApp extends React.Component {
  constructor(props) {
    super(props);
    const gps = [
      new GP(0, [1, 0.2, 1], 1, [], [], []),
    ];

    this.state = {
      GPs: gps,
      newGPParam: 1.0,
      newGPNoise: 0.2,
      newGPSignalVariance: 1,
      newGPcf: 0,
      numGPs: 1,
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

  setAlfa(newVal) {
    this.setState({ alfa: newVal });
  }

  setStepSize(newVal) {
    this.setState({ stepSize: newVal });
  }

  setNSteps(newVal) {
    this.setState({ NSteps: newVal });
  }

  toggleAddTrPoints() {
    if (this.state.addTrPoints) {
      // added training points
      var dmTr = computeDistanceMatrix(
        this.state.trPointsX,
        this.state.trPointsX
      );
      var dmTeTr = computeDistanceMatrix(tePointsX, this.state.trPointsX);

      var newGPs = recomputeProjections(
        this.state.GPs,
        dmTr,
        dmTeTr,
        this.state.trPointsY
      );
      this.setState({
        addTrPoints: !this.state.addTrPoints,
        GPs: newGPs,
        dmTr: dmTr,
        dmTeTr: dmTeTr,
        samplingState: this.state.oldSamplingState
      });
    } else {
      // beginning to add training points
      this.setState({
        addTrPoints: !this.state.addTrPoints,
        oldSamplingState: this.state.samplingState,
        samplingState: 0
      });
    }
  }

  clearTrPoints() {
    this.setState({ trPointsX: [], trPointsY: [] });
  }

  componentDidMount() {

    function stopIfNeeded() {
      if (!checkVisible(ReactDOM.findDOMNode(this.axis))) {
        this.stopSampling();
      }
    }

    this.timer = setInterval(stopIfNeeded.bind(this), 30);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  toggleShowMeanAndVar() {
    // if (!this.state.addTrPoints)
    this.setState({ showMeanAndVar: !this.state.showMeanAndVar });
    this.forceUpdate();
  }

  toggleShowSamples() {
    if (!this.state.addTrPoints) {
      if (this.state.showSamples) {
        this.setState({ samplingState: 0, showSamples: false });
      } else {
        this.setState({
          samplingState: this.state.oldSamplingState,
          showSamples: true
        });
      }
    }
  }

  setNewGPParam(newVal) {
    let gps = this.state.GPs;
    for (var i = 0; i < gps.length; i++) {
      const gp = gps[i];
      gps[i] = new GP(gps[i].cf, [newVal, gp.params[1], gp.params[2]], gp.id, [], [], []);
    }
    this.setState({ newGPParam: newVal, GPs: gps });
  }

  setNewGPNoise(newVal) {
    let gps = this.state.GPs;
    for (var i = 0; i < gps.length; i++) {
      const gp = gps[i];
      gps[i] = new GP(gps[i].cf, [gp.params[0], newVal, gp.params[2]], gp.id, [], [], []);
    }
    this.setState({ newGPNoise: newVal, GPs: gps });
  }

  setNewGPSignalVariance(newVal) {
    let gps = this.state.GPs;
    for (var i = 0; i < gps.length; i++) {
      const gp = gps[i];
      gps[i] = new GP(
        gps[i].cf,
        [gp.params[0], gp.params[1], newVal],
        gp.id,
        [],
        [],
        []
      );
    }
    this.setState({ newGPSignalVariance: newVal, GPs: gps });
  }

  setNewGPcf(event) {
    var gps = this.state.GPs;
    for (var i = 0; i < gps.length; i++) {
      gps[i] = new GP(
        event.target.value,
        [this.state.newGPParam, this.state.newGPNoise, this.state.newGPSignalVariance],
        gps[i].id,
        this.state.dmTr,
        this.state.dmTeTr,
        this.state.trPointsY
      );
    }
    this.setState({ newGPcf: event.target.value, GPs: gps });
  }

  setNumGPs(event) {
    var gps = new Array(event.target.value);
    for (var i = 0; i < event.target.value; i++) {
      gps[i] = new GP(
        this.state.GPs[0].cf,
        [this.state.newGPParam, this.state.newGPNoise, this.state.newGPSignalVariance],
        i+1,
        this.state.dmTr,
        this.state.dmTeTr,
        this.state.trPointsY
      );
    }
    this.setState({ numGPs: event.target.value, GPs: gps });
  }

  addGP() {
    if (this.state.newGPavailableIDs.length < 1) return;
    var id = this.state.newGPavailableIDs.pop();
    var newGPs = this.state.GPs.concat([
      new GP(
        this.state.newGPcf,
        [this.state.newGPParam, this.state.newGPNoise],
        id,
        this.state.dmTr,
        this.state.dmTeTr,
        this.state.trPointsY
      )
    ]);
    this.setState({
      GPs: newGPs,
      newGPavailableIDs: this.state.newGPavailableIDs
    });
  }

  delGP(id) {
    return function() {
      var newGPs = this.state.GPs;
      var delIdx = newGPs.findIndex(function(g) {
        return g.id == id;
      });
      if (delIdx >= 0) {
        newGPs.splice(delIdx, 1);
        this.state.newGPavailableIDs.push(id);
        this.setState({ GPs: newGPs });
      }
    }.bind(this);
  }

  addTrPoint(x, y) {
    if (x >= -5 && x <= 5 && y >= -3 && y <= 3) {
      var newTrPointsX = this.state.trPointsX.concat([x]);
      var newTrPointsY = this.state.trPointsY.concat([y]);
      this.setState({ trPointsX: newTrPointsX, trPointsY: newTrPointsY });
    }
  }

  stopSampling() {
    this.setState({ samplingState: 0, oldSamplingState: 0 });
  }

  toggleSampling() {
    if (this.state.samplingState != 0) {
      this.setState({ samplingState: 0, oldSamplingState: 0 });
    } else {
      this.startContinuousSampling();
    }
  }

  startDiscreteSampling() {
    this.setState({ samplingState: 1, oldSamplingState: 1 });
  }

  startContinuousSampling() {
    this.setState({ samplingState: 2, oldSamplingState: 2 });
  }

  render() {
    const sliderOpt = this.props.sliderOpt;
    let addNoise = false;
    const gpoptions = cfs.slice(0, 4).map(function(c) {
      return (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      );
    });
    var control;
    if (this.props.ty == "lengthscales") {
      control = (
        <div>
          Length scale{" "}
          <Slider
            value={this.state.newGPParam}
            setValue={this.setNewGPParam.bind(this)}
            opt={sliderOpt}
          />
          {this.state.newGPParam.toFixed(2)}
        </div>
      );
    } else if (this.props.ty == "signal") {
      control = (
        <div>
          Signal Variance{" "}
          <Slider
            value={this.state.newGPSignalVariance}
            setValue={this.setNewGPSignalVariance.bind(this)}
            opt={sliderOpt}
          />{" "}
          {this.state.newGPSignalVariance.toFixed(2)}
        </div>
      );
    } else if (this.props.ty == "noise") {
      addNoise = true;
      control = (
        <div>
          Noise{" "}
          <Slider
            value={this.state.newGPNoise}
            setValue={this.setNewGPNoise.bind(this)}
            opt={sliderOpt}
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
      <div>
        <div>
          <div>{control}</div>
          <button onClick={this.toggleSampling.bind(this)}>
            {this.state.samplingState == 0 ? "Start" : "Stop"}
          </button>
          <select onChange={this.setNumGPs.bind(this)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
        <GPAxis
          ref={axis => this.axis = axis}
          state={this.state}
          addNoise={addNoise}
          config={this.props.config}
          addTrPoint={this.addTrPoint.bind(this)}
        />
      </div>
    );
  }
}

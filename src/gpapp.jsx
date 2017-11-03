import {GP, GPAxis, cfs} from "./gputils";
import Slider from "./slider";

export default class GPApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { GPs: [new GP(0, [1,0.2], 1, [], [], [])],
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

  setAlfa(newVal) { this.setState({ alfa: newVal }); }
  setStepSize(newVal) { this.setState({ stepSize: newVal }); }
  setNSteps(newVal) { this.setState({ NSteps: newVal }); }

  toggleAddTrPoints() {
    if (this.state.addTrPoints){
      // added training points
      var dmTr = computeDistanceMatrix(this.state.trPointsX, this.state.trPointsX);
      var dmTeTr = computeDistanceMatrix(tePointsX, this.state.trPointsX);

      var newGPs = recomputeProjections(this.state.GPs, dmTr, dmTeTr, this.state.trPointsY);
      this.setState({ addTrPoints: !this.state.addTrPoints, GPs: newGPs, dmTr: dmTr, dmTeTr: dmTeTr, samplingState: this.state.oldSamplingState });
    } else {
      // beginning to add training points
      this.setState({ addTrPoints: !this.state.addTrPoints, oldSamplingState: this.state.samplingState, samplingState: 0 });
    }
  }
  clearTrPoints() { this.setState({ trPointsX: [], trPointsY: [] }); }

  toggleShowMeanAndVar() { 
    // if (!this.state.addTrPoints) 
    this.setState({ showMeanAndVar: !this.state.showMeanAndVar }); 
  }

  toggleShowSamples() {
    if (!this.state.addTrPoints) {
      if (this.state.showSamples) {
        this.setState({ samplingState: 0, showSamples: false });
      } else {
        this.setState({ samplingState: this.state.oldSamplingState, showSamples: true });
      }
    }
  }

  setNewGPParam(newVal) { 
    let gps = this.state.GPs;
    for (var i = 0; i < gps.length; i++) {
      const gp = gps[i];
      console.log(newVal);
      gps[i] = new GP(gps[i].cf, [newVal, gp.params[1]], gp.id, [], [], [])
    }
    this.setState({newGPParam: newVal, GPs: gps});
  }

  setNewGPNoise(newVal) { 
    let gps = this.state.GPs;
    for (var i = 0; i < gps.length; i++) {
      const gp = gps[i];
      console.log(newVal);
      gps[i] = new GP(gps[i].cf, [gp.params[0], newVal], gp.id, [], [], [])
    }
    this.setState({newGPNoise: newVal, GPs: gps});
  }

  setNewGPcf(event) { 
    var gps = this.state.GPs;
    for (var i = 0; i < gps.length; i++) {
      console.log(this.state.newGPcf);
      gps[i] = new GP(event.target.value, 
      [this.state.newGPParam, this.state.newGPNoise], gps[i].id,
       this.state.dmTr, this.state.dmTeTr, this.state.trPointsY);
    }
    this.setState({newGPcf: event.target.value, GPs: gps});
  }

  addGP() {
    if (this.state.newGPavailableIDs.length < 1) return;
    var id = this.state.newGPavailableIDs.pop();
    var newGPs = this.state.GPs.concat([new GP(this.state.newGPcf, 
      [this.state.newGPParam, this.state.newGPNoise], id, this.state.dmTr, this.state.dmTeTr, this.state.trPointsY)]);
    this.setState({ GPs: newGPs, newGPavailableIDs: this.state.newGPavailableIDs });
  }

  delGP(id) {
    return (function() {
      var newGPs = this.state.GPs;
      var delIdx = newGPs.findIndex(function (g) { return g.id == id; });
      if (delIdx >= 0) {
        newGPs.splice(delIdx, 1);
        this.state.newGPavailableIDs.push(id);
        this.setState({ GPs: newGPs });
      }
    }).bind(this);
  }

  addTrPoint(x, y) {
    if (x >= -5 && x <= 5 && y >= -3 && y <= 3){
      var newTrPointsX = this.state.trPointsX.concat([x]);
      var newTrPointsY = this.state.trPointsY.concat([y]);
      this.setState({ trPointsX: newTrPointsX, trPointsY: newTrPointsY });
    }
  }
  stopSampling() { 
    this.setState({ samplingState: 0, oldSamplingState: 0 }); }
  startDiscreteSampling() { 
    this.setState({ samplingState: 1, oldSamplingState: 1 }); 
  }
  startContinuousSampling() { this.setState({ samplingState: 2, oldSamplingState: 2 }); }
  render() {
    var sliderOptAlfa     = { width: 200, height: 9, min: 0, max: 1 };
    var sliderOptStepSize = { width: 200, height: 9, min: 0, max: 2 * Math.PI };
    var sliderOptNSteps   = { width: 200, height: 9, min: 1, max: 100, step: 1 };
    var sliderOptGPParam  = { width: 200, height: 9, min: 0.01, max: 5 };
    var sliderOptGPNoise  = { width: 200, height: 9, min: 0, max: 2 };
    var delGP = this.delGP;
    var gpoptions = cfs.map(function (c) {
      return (<option key={c.id} value={c.id}>{c.name}</option>);
    });

    if (this.props.ty == 'lengthscales' ) {
      var w = <div>Length scale <Slider value={this.state.newGPParam} setValue={this.setNewGPParam.bind(this)} opt={sliderOptGPParam} /> 
                  {this.state.newGPParam.toFixed(2)}
              </div>
    } else if (this.props.ty == 'noise') {
      var w = <div>Noise <Slider value={this.state.newGPNoise} setValue={this.setNewGPNoise.bind(this)} opt={sliderOptGPNoise} /> {this.state.newGPNoise.toFixed(2)}</div>
    } else { // fallback to covariance
      var w = <div>Covariance function <select value={this.state.newGPcf} onChange={this.setNewGPcf.bind(this)}>{gpoptions}</select></div>
    }
    return (
      <div id="gp" onMouseEnter={this.startContinuousSampling.bind(this)} 
                   onMouseLeave={this.stopSampling.bind(this)}>
        <div id="gplist">
          <div id="addgp">  
          <div> 
          {w} 
          {/* <button onClick={this.addGP.bind(this)} disabled={this.state.newGPavailableIDs.length <= 0}>add</button>  */}
          </div>
        </div>
        <div className="l-screen">
        <figure>
          <div id="controls">
            <input type="checkbox" checked={this.state.showMeanAndVar} onChange={this.toggleShowMeanAndVar.bind(this)} />
            Show mean and credible intervals
            <br />
            <input type="checkbox" checked={this.state.showSamples} onChange={this.toggleShowSamples.bind(this)} />Show samples<br />
            {/* <button onClick={this.startDiscreteSampling.bind(this)} disabled={this.state.samplingState === 1 || this.state.addTrPoints || !this.state.showSamples}>sample independently</button>
            <br /> */}
            <button onClick={this.startContinuousSampling.bind(this)} disabled={this.state.samplingState === 2 || this.state.addTrPoints || !this.state.showSamples}>sample continuous trajectories</button>
            <br />
            <button onClick={this.stopSampling.bind(this)} disabled={this.state.samplingState === 0 || this.state.addTrPoints}>stop sampling</button>
            <br />
            {this.state.addTrPoints ? <span className="info"> click on the figure to add an observation </span> : ''}
            <button onClick={this.toggleAddTrPoints.bind(this)}>{this.state.addTrPoints ? "done" : "add observations"}</button>
            {this.state.addTrPoints ? <button onClick={this.clearTrPoints.bind(this)}>clear</button> : ''}
          </div>
          <GPAxis state={this.state} addTrPoint={this.addTrPoint.bind(this)} />
          <figcaption>{this.props.caption}</figcaption>
        </figure>
        </div>
        </div>
      </div>
    )
  }
}
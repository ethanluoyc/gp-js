/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _gpapp = __webpack_require__(1);

var _gpapp2 = _interopRequireDefault(_gpapp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var comp0 = ReactDOM.render(React.createElement(_gpapp2.default, { ty: "lengthscales", caption: "Different length scales" }), document.getElementById('gp-lengthscales'));

var comp1 = ReactDOM.render(React.createElement(_gpapp2.default, { ty: "noise", caption: "Different noise" }), document.getElementById('gp-noise'));

var comp2 = ReactDOM.render(React.createElement(_gpapp2.default, { ty: "covariance", caption: "Different covariance function" }), document.getElementById('gp-covariance'));

console.log('All loaded');

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gputils = __webpack_require__(2);

var _slider = __webpack_require__(3);

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GPApp = function (_React$Component) {
  _inherits(GPApp, _React$Component);

  function GPApp(props) {
    _classCallCheck(this, GPApp);

    var _this = _possibleConstructorReturn(this, (GPApp.__proto__ || Object.getPrototypeOf(GPApp)).call(this, props));

    var gps = [new _gputils.GP(0, [1, 0.2], 1, [], [], []), new _gputils.GP(0, [1, 0.2], 2, [], [], []), new _gputils.GP(0, [1, 0.2], 3, [], [], []), new _gputils.GP(0, [1, 0.2], 4, [], [], []), new _gputils.GP(0, [1, 0.2], 5, [], [], [])];
    _this.state = {
      GPs: gps,
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
    return _this;
  }

  _createClass(GPApp, [{
    key: "setAlfa",
    value: function setAlfa(newVal) {
      this.setState({ alfa: newVal });
    }
  }, {
    key: "setStepSize",
    value: function setStepSize(newVal) {
      this.setState({ stepSize: newVal });
    }
  }, {
    key: "setNSteps",
    value: function setNSteps(newVal) {
      this.setState({ NSteps: newVal });
    }
  }, {
    key: "toggleAddTrPoints",
    value: function toggleAddTrPoints() {
      if (this.state.addTrPoints) {
        // added training points
        var dmTr = computeDistanceMatrix(this.state.trPointsX, this.state.trPointsX);
        var dmTeTr = computeDistanceMatrix(tePointsX, this.state.trPointsX);

        var newGPs = recomputeProjections(this.state.GPs, dmTr, dmTeTr, this.state.trPointsY);
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
  }, {
    key: "clearTrPoints",
    value: function clearTrPoints() {
      this.setState({ trPointsX: [], trPointsY: [] });
    }
  }, {
    key: "toggleShowMeanAndVar",
    value: function toggleShowMeanAndVar() {
      // if (!this.state.addTrPoints) 
      this.setState({ showMeanAndVar: !this.state.showMeanAndVar });
    }
  }, {
    key: "toggleShowSamples",
    value: function toggleShowSamples() {
      if (!this.state.addTrPoints) {
        if (this.state.showSamples) {
          this.setState({ samplingState: 0, showSamples: false });
        } else {
          this.setState({ samplingState: this.state.oldSamplingState, showSamples: true });
        }
      }
    }
  }, {
    key: "setNewGPParam",
    value: function setNewGPParam(newVal) {
      var gps = this.state.GPs;
      for (var i = 0; i < gps.length; i++) {
        var gp = gps[i];
        gps[i] = new _gputils.GP(gps[i].cf, [newVal, gp.params[1]], gp.id, [], [], []);
      }
      this.setState({ newGPParam: newVal, GPs: gps });
    }
  }, {
    key: "setNewGPNoise",
    value: function setNewGPNoise(newVal) {
      var gps = this.state.GPs;
      for (var i = 0; i < gps.length; i++) {
        var gp = gps[i];
        gps[i] = new _gputils.GP(gps[i].cf, [gp.params[0], newVal], gp.id, [], [], []);
      }
      this.setState({ newGPNoise: newVal, GPs: gps });
    }
  }, {
    key: "setNewGPcf",
    value: function setNewGPcf(event) {
      var gps = this.state.GPs;
      for (var i = 0; i < gps.length; i++) {
        gps[i] = new _gputils.GP(event.target.value, [this.state.newGPParam, this.state.newGPNoise], gps[i].id, this.state.dmTr, this.state.dmTeTr, this.state.trPointsY);
      }
      this.setState({ newGPcf: event.target.value, GPs: gps });
    }
  }, {
    key: "addGP",
    value: function addGP() {
      if (this.state.newGPavailableIDs.length < 1) return;
      var id = this.state.newGPavailableIDs.pop();
      var newGPs = this.state.GPs.concat([new _gputils.GP(this.state.newGPcf, [this.state.newGPParam, this.state.newGPNoise], id, this.state.dmTr, this.state.dmTeTr, this.state.trPointsY)]);
      this.setState({ GPs: newGPs, newGPavailableIDs: this.state.newGPavailableIDs });
    }
  }, {
    key: "delGP",
    value: function delGP(id) {
      return function () {
        var newGPs = this.state.GPs;
        var delIdx = newGPs.findIndex(function (g) {
          return g.id == id;
        });
        if (delIdx >= 0) {
          newGPs.splice(delIdx, 1);
          this.state.newGPavailableIDs.push(id);
          this.setState({ GPs: newGPs });
        }
      }.bind(this);
    }
  }, {
    key: "addTrPoint",
    value: function addTrPoint(x, y) {
      if (x >= -5 && x <= 5 && y >= -3 && y <= 3) {
        var newTrPointsX = this.state.trPointsX.concat([x]);
        var newTrPointsY = this.state.trPointsY.concat([y]);
        this.setState({ trPointsX: newTrPointsX, trPointsY: newTrPointsY });
      }
    }
  }, {
    key: "stopSampling",
    value: function stopSampling() {
      this.setState({ samplingState: 0, oldSamplingState: 0 });
    }
  }, {
    key: "toggleSampling",
    value: function toggleSampling() {
      if (this.state.samplingState != 0) {
        this.setState({ samplingState: 0, oldSamplingState: 0 });
      } else {
        this.startContinuousSampling();
      }
    }
  }, {
    key: "startDiscreteSampling",
    value: function startDiscreteSampling() {
      this.setState({ samplingState: 1, oldSamplingState: 1 });
    }
  }, {
    key: "startContinuousSampling",
    value: function startContinuousSampling() {
      this.setState({ samplingState: 2, oldSamplingState: 2 });
    }
  }, {
    key: "render",
    value: function render() {
      var sliderOptAlfa = { width: 200, height: 9, min: 0, max: 1 };
      var sliderOptStepSize = { width: 200, height: 9, min: 0, max: 2 * Math.PI };
      var sliderOptNSteps = { width: 200, height: 9, min: 1, max: 100, step: 1 };
      var sliderOptGPParam = { width: 200, height: 9, min: 0.01, max: 5 };
      var sliderOptGPNoise = { width: 200, height: 9, min: 0, max: 2 };
      var delGP = this.delGP;
      var gpoptions = _gputils.cfs.map(function (c) {
        return React.createElement(
          "option",
          { key: c.id, value: c.id },
          c.name
        );
      });

      if (this.props.ty == 'lengthscales') {
        var w = React.createElement(
          "div",
          null,
          "Length scale ",
          React.createElement(_slider2.default, { value: this.state.newGPParam, setValue: this.setNewGPParam.bind(this),
            opt: sliderOptGPParam }),
          this.state.newGPParam.toFixed(2)
        );
      } else if (this.props.ty == 'noise') {
        var w = React.createElement(
          "div",
          null,
          "Noise ",
          React.createElement(_slider2.default, { value: this.state.newGPNoise, setValue: this.setNewGPNoise.bind(this),
            opt: sliderOptGPNoise }),
          " ",
          this.state.newGPNoise.toFixed(2)
        );
      } else {
        // fallback to covariance
        var w = React.createElement(
          "div",
          null,
          "Covariance function ",
          React.createElement(
            "select",
            { value: this.state.newGPcf,
              onChange: this.setNewGPcf.bind(this) },
            gpoptions
          )
        );
      }
      return React.createElement(
        "div",
        { id: "gp" },
        React.createElement(
          "div",
          { id: "gplist" },
          React.createElement(
            "div",
            { id: "addgp" },
            React.createElement(
              "div",
              null,
              w
            ),
            React.createElement(
              "button",
              { onClick: this.toggleSampling.bind(this) },
              this.state.samplingState == 0 ? "Start" : "Stop"
            )
          ),
          React.createElement(
            "div",
            { className: "l-screen" },
            React.createElement(
              "figure",
              null,
              React.createElement(
                "div",
                { id: "controls" },
                React.createElement("br", null),
                React.createElement("br", null)
              ),
              React.createElement(_gputils.GPAxis, { state: this.state, addTrPoint: this.addTrPoint.bind(this) }),
              React.createElement(
                "figcaption",
                null,
                this.props.caption
              )
            )
          )
        )
      );
    }
  }]);

  return GPApp;
}(React.Component);

exports.default = GPApp;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tePointsX = numeric.linspace(-5, 5, numeric.dim(distmatTe)[0]);
var randn = d3.random.normal();
function randnArray(size) {
  var zs = new Array(size);
  for (var i = 0; i < size; i++) {
    zs[i] = randn();
  }
  return zs;
}

// ids must be in order of the array
var cfs = [{ 'id': 0,
  'name': 'Exponentiated quadratic',
  'f': function f(r, params) {
    return numeric.exp(numeric.mul(-0.5 / (params[0] * params[0]), numeric.pow(r, 2)));
  }
}, { 'id': 1,
  'name': 'Exponential',
  'f': function f(r, params) {
    return numeric.exp(numeric.mul(-0.5 / params[0], r));
  }
}, { 'id': 2,
  'name': 'Matern 3/2',
  'f': function f(r, params) {
    var tmp = numeric.mul(Math.sqrt(3.0) / params[0], r);
    return numeric.mul(numeric.add(1.0, tmp), numeric.exp(numeric.neg(tmp)));
  }
}, { 'id': 3,
  'name': 'Matern 5/2',
  'f': function f(r, params) {
    var tmp = numeric.mul(Math.sqrt(5.0) / params[0], r);
    var tmp2 = numeric.div(numeric.mul(tmp, tmp), 3.0);
    return numeric.mul(numeric.add(numeric.add(1, tmp), tmp2), numeric.exp(numeric.neg(tmp)));
  }
}, { 'id': 4,
  'name': 'Rational quadratic (alpha=1)',
  'f': function f(r, params) {
    return numeric.pow(numeric.add(1.0, numeric.div(numeric.pow(r, 2), 2.0 * params[0] * params[0])), -1);
  }
}, { 'id': 5,
  'name': 'Piecewise polynomial (q=0)',
  'f': function f(r, params) {
    var tmp = numeric.sub(1.0, numeric.div(r, params[0]));
    var dims = numeric.dim(tmp);
    for (var i = 0; i < dims[0]; i++) {
      for (var j = 0; j < dims[1]; j++) {
        tmp[i][j] = tmp[i][j] > 0.0 ? tmp[i][j] : 0.0;
      }
    }
    return tmp;
  }
}, { 'id': 6,
  'name': 'Piecewise polynomial (q=1)',
  'f': function f(r, params) {
    var tmp1 = numeric.div(r, params[0]);
    var tmp = numeric.sub(1.0, tmp1);
    var dims = numeric.dim(tmp);
    for (var i = 0; i < dims[0]; i++) {
      for (var j = 0; j < dims[1]; j++) {
        tmp[i][j] = tmp[i][j] > 0.0 ? tmp[i][j] : 0.0;
      }
    }
    return numeric.mul(numeric.pow(tmp, 3), numeric.add(numeric.mul(3.0, tmp1), 1.0));
  }
}, { 'id': 7,
  'name': 'Periodic (period=pi)',
  'f': function f(r, params) {
    return numeric.exp(numeric.mul(-2.0 / (params[0] * params[0]), numeric.pow(numeric.sin(r), 2)));
  }
}, { 'id': 8,
  'name': 'Periodic (period=1)',
  'f': function f(r, params) {
    return numeric.exp(numeric.mul(-2.0 / (params[0] * params[0]), numeric.pow(numeric.sin(numeric.mul(Math.PI, r)), 2)));
  }
}];

function GP(cf, params, id, dmTr, dmTeTr, trY) {
  var M = numeric.dim(distmatTe)[1];

  this.z = randnArray(M);
  this.p = randnArray(M);
  this.cf = cf;
  this.params = params;
  this.id = id;

  this.Kte = cfs[this.cf].f(distmatTe, params);

  var tmp = computeProjection(this.Kte, this.cf, this.params, dmTr, dmTeTr, trY);
  this.proj = tmp.proj;
  this.mu = tmp.mu;
  this.sd95 = tmp.sd95;
}

function computeProjection(Kte, cf, params, dmTr, dmTeTr, trY) {
  var Mtr = numeric.dim(dmTr)[0];
  var Mte = numeric.dim(distmatTe)[0];

  if (Mtr > 0) {
    var Kxx_p_noise = cfs[cf].f(dmTr, params);
    for (var i = 0; i < Mtr; i++) {
      Kxx_p_noise[i][i] += params[1];
    }

    var svd1 = numeric.svd(Kxx_p_noise);
    for (var i = 0; i < Mtr; i++) {
      if (svd1.S[i] > numeric.epsilon) {
        svd1.S[i] = 1.0 / svd1.S[i];
      } else {
        svd1.S[i] = 0.0;
      }
    }

    var tmp = numeric.dot(cfs[cf].f(dmTeTr, params), svd1.U);
    // there seems to be a bug in numeric.svd: svd1.U and transpose(svd1.V) are not always equal for a symmetric matrix
    var mu = numeric.dot(tmp, numeric.mul(svd1.S, numeric.dot(numeric.transpose(svd1.U), trY)));
    var cov = numeric.dot(tmp, numeric.diag(numeric.sqrt(svd1.S)));
    cov = numeric.dot(cov, numeric.transpose(cov));
    cov = numeric.sub(Kte, cov);
    var svd2 = numeric.svd(cov);
    for (var i = 0; i < Mte; i++) {
      if (svd2.S[i] < numeric.epsilon) {
        svd2.S[i] = 0.0;
      }
    }
    var proj = numeric.dot(svd2.U, numeric.diag(numeric.sqrt(svd2.S)));
    var sd95 = numeric.mul(1.98, numeric.sqrt(numeric.getDiag(numeric.dot(proj, numeric.transpose(proj)))));
  } else {
    var sd95 = numeric.mul(1.98, numeric.sqrt(numeric.getDiag(Kte)));
    var svd = numeric.svd(Kte);
    var proj = numeric.dot(svd.U, numeric.diag(numeric.sqrt(svd.S)));
    var mu = numeric.rep([Mte], 0);
  }

  return { proj: proj, mu: mu, sd95: sd95 };
}

function recomputeProjections(GPs, dmTr, dmTeTr, trY) {
  for (var gpi = 0; gpi < GPs.length; gpi++) {
    var gp = GPs[gpi];
    var tmp = computeProjection(gp.Kte, gp.cf, gp.params, dmTr, dmTeTr, trY);
    gp.Kte = cfs[gp.cf].f(distmatTe, gp.params);
    gp.proj = tmp.proj;
    gp.mu = tmp.mu;
    gp.sd95 = tmp.sd95;
    GPs[gpi] = gp;
  }
  return GPs;
}

function computeDistanceMatrix(xdata1, xdata2) {
  var dm = numeric.rep([xdata1.length, xdata2.length], 0);
  for (var i = 0; i < xdata1.length; i++) {
    for (var j = 0; j < xdata2.length; j++) {
      var val = Math.abs(xdata2[j] - xdata1[i]);
      dm[i][j] = val;
    }
  }
  return dm;
}

var GPAxis = function (_React$Component) {
  _inherits(GPAxis, _React$Component);

  function GPAxis(props) {
    _classCallCheck(this, GPAxis);

    var _this = _possibleConstructorReturn(this, (GPAxis.__proto__ || Object.getPrototypeOf(GPAxis)).call(this, props));

    _this.scales = { x: null, y: null };
    _this.animationId = 0;
    _this.stepState = 0;
    return _this;
  }

  _createClass(GPAxis, [{
    key: 'render',
    value: function render() {
      return React.createElement('svg', null);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: 'drawTrPoints',
    value: function drawTrPoints(pointsX, pointsY) {
      var x = this.scales.x;
      var y = this.scales.y;
      var p = this.trPoints.selectAll("circle.trpoints").data(d3.zip(pointsX, pointsY)).attr("cx", function (d) {
        return x(d[0]);
      }).attr("cy", function (d) {
        return y(d[1]);
      });
      p.enter().append("circle").attr("class", "trpoints").attr("r", 2).attr("cx", function (d) {
        return x(d[0]);
      }).attr("cy", function (d) {
        return y(d[1]);
      });
      p.exit().remove();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      // bind events
      if (props.state.addTrPoints) {
        d3.select(ReactDOM.findDOMNode(this)).on("click", this.addTrPoint);
      } else {
        d3.select(ReactDOM.findDOMNode(this)).on("click", null);
      }
      // redraw training points
      this.drawTrPoints(props.state.trPointsX, props.state.trPointsY);

      if (this.props.state.showSamples !== props.state.showSamples) {
        this.drawPaths(props);
      }

      if (this.props.state.samplingState !== props.state.samplingState) {
        clearInterval(this.animationId);
        if (props.state.samplingState === 1) {
          this.animationId = setInterval(function () {
            this.updateState();this.drawPaths();
          }.bind(this), 500);
        } else if (props.state.samplingState === 2) {
          this.animationId = setInterval(function () {
            this.contUpdateState();this.drawPaths();
          }.bind(this), 50);
        }
      }
    }
  }, {
    key: 'addTrPoint',
    value: function addTrPoint() {
      var mousePos = d3.mouse(ReactDOM.findDOMNode(this));
      var x = this.scales.x;
      var y = this.scales.y;

      // x is transformed to a point on a grid of 200 points between -5 and 5
      this.props.addTrPoint(Math.round((x.invert(mousePos[0] - 50) + 5) / 10 * 199) / 199 * 10 - 5, y.invert(mousePos[1] - 50));
    }
  }, {
    key: 'updateState',
    value: function updateState() {
      var M = numeric.dim(distmatTe)[1];
      for (var i = 0; i < this.props.state.GPs.length; i++) {
        var gp = this.props.state.GPs[i];
        gp.z = randnArray(M);
      }
    }
  }, {
    key: 'contUpdateState',
    value: function contUpdateState() {
      var M = numeric.dim(distmatTe)[1];
      var alfa = 1.0 - this.props.state.alfa;
      var n_steps = this.props.state.NSteps;
      var t_step = this.props.state.stepSize / n_steps;
      this.stepState = this.stepState % n_steps;

      this.drawMeanAndVar(this.props);

      for (var i = 0; i < this.props.state.GPs.length; i++) {
        var gp = this.props.state.GPs[i];

        // refresh momentum: p = alfa * p + sqrt(1 - alfa^2) * randn(size(p))
        if (this.stepState == n_steps - 1) gp.p = numeric.add(numeric.mul(alfa, gp.p), numeric.mul(Math.sqrt(1 - alfa * alfa), randnArray(M)));

        var a = gp.p.slice(0),
            b = gp.z.slice(0),
            c = numeric.mul(-1, gp.z.slice(0)),
            d = gp.p.slice(0);

        gp.z = numeric.add(numeric.mul(a, Math.sin(t_step)), numeric.mul(b, Math.cos(t_step)));
        gp.p = numeric.add(numeric.mul(c, Math.sin(t_step)), numeric.mul(d, Math.cos(t_step)));
      }
      this.stepState = this.stepState + 1;
    }
  }, {
    key: 'drawMeanAndVar',
    value: function drawMeanAndVar(props) {
      var gpline = this.gpline;
      if (props.state.showMeanAndVar) {
        var gps = props.state.GPs;
      } else {
        var gps = [];
      }

      var paths = this.meanLines.selectAll("path").data(gps, function (d) {
        return d.id;
      }).attr("d", function (d) {
        var datay = d.mu;
        return gpline(d3.zip(tePointsX, datay));
      });
      paths.enter().append("path").attr("d", function (d) {
        var datay = d.mu;
        return gpline(d3.zip(tePointsX, datay));
      }).attr("class", function (d) {
        return "muline line line" + d.id;
      });
      paths.exit().remove();

      var pathsUp = this.upSd95Lines.selectAll("path").data(gps, function (d) {
        return d.id;
      }).attr("d", function (d) {
        var datay = numeric.add(d.mu, d.sd95);
        return gpline(d3.zip(tePointsX, datay));
      });
      pathsUp.enter().append("path").attr("d", function (d) {
        var datay = numeric.add(d.mu, d.sd95);
        return gpline(d3.zip(tePointsX, datay));
      }).attr("class", function (d) {
        return "sdline line line" + d.id;
      });
      pathsUp.exit().remove();

      var pathsDown = this.downSd95Lines.selectAll("path").data(gps, function (d) {
        return d.id;
      }).attr("d", function (d) {
        var datay = numeric.sub(d.mu, d.sd95);
        return gpline(d3.zip(tePointsX, datay));
      });
      pathsDown.enter().append("path").attr("d", function (d) {
        var datay = numeric.sub(d.mu, d.sd95);
        return gpline(d3.zip(tePointsX, datay));
      }).attr("class", function (d) {
        return "sdline line line" + d.id;
      });
      pathsDown.exit().remove();
    }
  }, {
    key: 'drawPaths',
    value: function drawPaths(props) {
      if (!props) var props = this.props;
      var gpline = this.gpline;
      if (props.state.showSamples) {
        var gps = props.state.GPs;
      } else {
        var gps = [];
      }

      var paths = this.lines.selectAll("path").data(gps, function (d) {
        return d.id;
      }).attr("d", function (d) {
        var datay = numeric.add(numeric.dot(d.proj, d.z), d.mu);
        return gpline(d3.zip(tePointsX, datay));
      });
      paths.enter().append("path").attr("d", function (d) {
        var datay = numeric.add(numeric.dot(d.proj, d.z), d.mu);
        return gpline(d3.zip(tePointsX, datay));
      }).attr("class", function (d) {
        return "line line" + d.id;
      });
      paths.exit().remove();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var svg = d3.select(ReactDOM.findDOMNode(this));
      var height = svg.attr("height"),
          width = svg.attr("width");
      if (!height) {
        height = 300;
        svg.attr("height", height);
      }
      if (!width) {
        width = 500;
        svg.attr("width", width);
      }
      var margin = 50;
      svg = svg.append("g").attr("transform", "translate(" + margin + "," + margin + ")");
      this.svg = svg;
      var fig_height = height - 2 * margin,
          fig_width = width - 2 * margin;

      // helper functions
      var x = d3.scale.linear().range([0, fig_width]).domain([-5, 5]);
      var y = d3.scale.linear().range([fig_height, 0]).domain([-3, 3]);
      this.scales.x = x;
      this.scales.y = y;
      var xAxis = d3.svg.axis().scale(x).ticks(5).orient("bottom");
      var yAxis = d3.svg.axis().scale(y).ticks(5).orient("left");
      this.gpline = d3.svg.line().x(function (d) {
        return x(d[0]);
      }).y(function (d) {
        return y(d[1]);
      });

      // axes
      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + fig_height + ")").call(xAxis);

      svg.append("g").attr("class", "y axis").call(yAxis);

      this.meanLines = svg.append("g");
      this.upSd95Lines = svg.append("g");
      this.downSd95Lines = svg.append("g");
      this.lines = svg.append("g");
      this.trPoints = svg.append("g");
      this.drawTrPoints(this.props.state.trPointsX, this.props.state.trPointsY);
      this.drawPaths();
    }
  }]);

  return GPAxis;
}(React.Component);

var GPList = function (_React$Component2) {
  _inherits(GPList, _React$Component2);

  function GPList() {
    _classCallCheck(this, GPList);

    return _possibleConstructorReturn(this, (GPList.__proto__ || Object.getPrototypeOf(GPList)).apply(this, arguments));
  }

  _createClass(GPList, [{
    key: 'render',
    value: function render() {
      var delGP = this.props.delGP;
      var gplist = this.props.GPs.map(function (gp) {
        return React.createElement(
          'tr',
          { key: gp.id },
          React.createElement(
            'td',
            { className: "tr" + gp.id },
            gp.id
          ),
          React.createElement(
            'td',
            null,
            cfs[gp.cf].name
          ),
          React.createElement(
            'td',
            null,
            gp.params[0].toFixed(2)
          ),
          React.createElement(
            'td',
            null,
            gp.params[1].toFixed(2)
          ),
          React.createElement(
            'td',
            null,
            React.createElement(
              'button',
              { onClick: delGP(gp.id) },
              'remove'
            )
          )
        );
      });
      return React.createElement(
        'table',
        null,
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              null,
              'id'
            ),
            React.createElement(
              'th',
              null,
              'covariance'
            ),
            React.createElement(
              'th',
              null,
              'length scale'
            ),
            React.createElement(
              'th',
              null,
              'noise'
            ),
            React.createElement('th', null)
          )
        ),
        React.createElement(
          'tbody',
          null,
          gplist
        )
      );
    }
  }]);

  return GPList;
}(React.Component);

exports.GP = GP;
exports.GPAxis = GPAxis;
exports.GPList = GPList;
exports.cfs = cfs;
exports.tePointsX = tePointsX;
exports.randn = randn;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Slider = function (_React$Component) {
  _inherits(Slider, _React$Component);

  function Slider() {
    _classCallCheck(this, Slider);

    return _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).apply(this, arguments));
  }

  _createClass(Slider, [{
    key: "render",
    value: function render() {
      // Just insert the svg-element and render rest in componentDidMount.
      // Marker location is updated in componentWillReceiveProps using d3.
      return React.createElement("svg", null);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      return false;
    } // Never re-render.

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var val = this.props.value;
      var setVal = this.props.setValue;
      var opt = this.props.opt;

      // set defaults for options if not given
      if (!opt.width) opt.width = 200;
      if (!opt.height) opt.height = 20;
      if (!opt.step) {
        opt.round = function (x) {
          return x;
        };
      } else {
        opt.round = function (x) {
          return Math.round(x / opt.step) * opt.step;
        };
      }
      if (!opt.min) opt.min = opt.round(0);
      if (!opt.max) opt.max = opt.round(1);
      if (opt.min > opt.max) {
        var tmp = opt.min;
        opt.min = opt.max;
        opt.max = tmp;
      }
      if (val > opt.max) setVal(opt.max);
      if (val < opt.min) setVal(opt.min);

      // calculate range
      var markerRadius = opt.height * 0.5;
      var x1 = markerRadius;
      var x2 = opt.width - markerRadius;

      // d3 helpers
      var scale = d3.scale.linear().domain([opt.min, opt.max]).range([x1, x2]);
      this.scale = scale;
      var setValFromMousePos = function setValFromMousePos(x) {
        setVal(opt.round(scale.invert(Math.max(x1, Math.min(x2, x)))));
      };
      var dragmove = function dragmove() {
        setValFromMousePos(d3.event.x);
      };
      var drag = d3.behavior.drag().on("drag", dragmove);

      // bind d3 events and insert background line and marker
      var svg = d3.select(ReactDOM.findDOMNode(this));
      svg.attr("class", "slider").attr("width", opt.width).attr("height", opt.height).on("click", function () {
        setValFromMousePos(d3.mouse(this)[0]);
      });
      svg.append("line").attr("x1", x1).attr("x2", x2).attr("y1", "50%").attr("y2", "50%").attr("class", "sliderbg");
      this.marker = svg.append("circle").attr("cy", "50%").attr("r", markerRadius).attr("class", "slidermv").datum(val).attr("cx", function (d) {
        return scale(d);
      }).call(drag);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      // update the marker location on receiving new props
      var scale = this.scale;
      this.marker.datum(props.value).attr("cx", function (d) {
        return scale(d);
      });
    }
  }]);

  return Slider;
}(React.Component);

exports.default = Slider;

/***/ })
/******/ ]);
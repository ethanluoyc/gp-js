ReactDOM.render(
  <GPApp ty="lengthscales" caption="different length scales"/>,
  document.getElementById('gp-lengthscales')
);

ReactDOM.render(
  <GPApp ty="noise" caption="different noise"/>,
  document.getElementById('gp-noise')
);

ReactDOM.render(
  <GPApp ty="covariance" caption="different covariance function"/>,
  document.getElementById('gp-covariance')
);

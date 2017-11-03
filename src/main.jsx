import GPApp from "./gpapp.js";

const comp0 = ReactDOM.render(
  <GPApp ty="lengthscales" caption="different length scales"/>,
  document.getElementById('gp-lengthscales')
);

for (var i=0; i < 5; ++i) {
  comp0.addGP();
}

const comp1 = ReactDOM.render(
  <GPApp ty="noise" caption="different noise"/>,
  document.getElementById('gp-noise')
);

for (var i=0; i < 5; ++i) {
  comp1.addGP();
}


const comp2 = ReactDOM.render(
  <GPApp ty="covariance" caption="different covariance function"/>,
  document.getElementById('gp-covariance')
);

for (var i=0; i < 5; ++i) {
  comp2.addGP();
}
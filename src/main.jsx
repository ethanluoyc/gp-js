import GPApp from "./gpapp.jsx";
import {GP} from "./gputils.jsx"

const comp0 = ReactDOM.render(
  <GPApp ty="lengthscales" caption="Different length scales"/>,
  document.getElementById('gp-lengthscales')
);

const comp1 = ReactDOM.render(
  <GPApp ty="noise" caption="Different noise"/>,
  document.getElementById('gp-noise')
);


const comp2 = ReactDOM.render(
  <GPApp ty="covariance" caption="Different covariance function"/>,
  document.getElementById('gp-covariance')
);

cosnole.log('I get called from print.js!');
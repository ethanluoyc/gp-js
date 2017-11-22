const React = require("react");
const ReactDOM = require("react-dom");

const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50,
};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// set the ranges
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([0, height]);

// // scale the range of the data
x.domain([0, 1]);
y.domain([-6, 6]);

// // define the line
const valueline = d3.line()
  .x(d => x(d[0]))
  .y(d => y(d[1]));

const svg = d3.select("#gp-noise-level")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const paths = svg.append("g");

// add the X Axis
svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x));

// add the Y Axis
svg.append("g")
  .call(d3.axisLeft(y));

let data;

d3.json("/data/Z_noise.json", (raw) => {
  // var gp = new GP(0, [1, 0.2], 1, [], [], []);
  // gp.z.sort(function (a, b) { return b - a; });
  // var data = gp.z.map(function (x) {return [x, Math.random(), 1];});
  data = raw;
  const dd = raw[0].map((d, i) => {
    d = numeric.transpose([numeric.linspace(0, 1, 500), d]);
    d.id = i;
    return d;
  });

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin

  paths.selectAll("path")
    .data(dd)
    .enter().append("path")
    .attr("class", (d) => "line line" + d.id)
    .attr("d", valueline);
});

function handleClick(e) {
  const el = document.getElementById("selector");
  console.log(data[el.selectedIndex]);
  const dd = data[el.selectedIndex].map((d, i) => {
    d = numeric.transpose([numeric.linspace(0, 1, 500), d]);
    d.id = i;
    return d;
  });

  const l = paths.selectAll("path").data(dd);
  l.enter().append("path")
    .attr("class", d => `line line${  d.id}`)
    .merge(l)
    .attr("d", valueline);
  l.exit().remove();
}

function Selector(props) {
  return (
    <select id="selector" name="foo" onChange={handleClick}>
    <option value="value1">1</option>
    <option value="value2">2</option>
    <option value="value3">3</option>
    <option value="value4">4</option>
    <option value="value5">5</option>
    <option value="value5">6</option>
    <option value="value5">7</option>
    </select>);
}

ReactDOM.render(<Selector />, document.getElementById("sel"));

var React = require('react');
var ReactDOM = require('react-dom');
import { GP, GPAxis } from "./gputils.jsx"
import GPApp from "./gpapp.jsx";

var n = 100,
    m = 100,
    values = new Array(n * m),
    padding = 30;

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

width = 400;
height = 400;

var thresholds = d3.range(1, 21)
    .map(function (p) { return Math.pow(2, p); });

var contours = d3.contours()
    .size([100, 100])
    .thresholds(numeric.linspace(1.2126317839226641 * 1.0001, 2.4, 20));

var color = d3.scaleLinear()
    .domain([0, 5])
    .interpolate(function () { return d3.interpolateYlGnBu; });

d3.json("/grid.json", function (error, data) {
    if (error) throw error;
    var dt = new Array(100 * 100);
    for (var i = 0; i < 100; ++i) {
        for (var j = 0; j < 100; ++j) {
            dt[i * 100 + j] = Math.abs(data[i][j]);
        }
    }

    var x = d3.scaleLinear()
        .domain([-2, 6])
        .rangeRound([0, width]),
        y = d3.scaleLinear()
            .domain([-2, 1])
            .rangeRound([height, 0])

    var xAxis = d3.axisBottom(x).ticks(10);
    var yAxis = d3.axisLeft(y).ticks(10);


    function mousemove(d, i) {
        var position = d3.mouse(this);
        console.log(x.invert(position[0]));
        console.log(y.invert(position[1]));
    }

    svg.append('g')
        .attr('transform', 'translate(30, 0)')
        .selectAll("path")
        .data(contours(dt))
        .enter().append("path")
        .attr("d", d3.geoPath(d3.geoIdentity().scale(width / n)))
        .attr("fill", function (d) { return color(d.value); })
        .on("click", mousemove);

    svg.append("g")
        .attr("class", "axis axis-y")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis);

    svg.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", "translate(30," + height + ")")
        .call(xAxis);

});

const comp = ReactDOM.render(
  <GPApp ty="covariance" caption="Different covariance function"/>,
  document.getElementById('gp')
);

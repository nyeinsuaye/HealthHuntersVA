var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var bcparseDate = d3.time.format("%d/%m/%y").parse;
var yrformat = d3.time.format("%Y");
var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Frequency:</strong> <span style='color:red'>" + d.PrecipTotal + "</span>";
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);


d3.csv("./data/weather.csv", type, function(error, data) {
    
  x.domain(data.map(function(d) { return bcparseDate(d.date); }));
  y.domain([0, d3.max(data, function(d) { 
          
          if(d.PrecipTotal !== "NaN"){
              console.log(d.PrecipTotal);
              return d.PrecipTotal;
          }else{
              return 0;
          }
          //return d.PrecipTotal; 
      })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { console.log(d.PrecipTotal); return y(d.PrecipTotal); })
      .attr("height", function(d) { return height - y(d.PrecipTotal); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

});

function type(d) {
    if(d.PrecipTotal !== "NaN"){
  d.PrecipTotal = +d.PrecipTotal;
    
  return d;
    }else{
        return 0;
    }
}
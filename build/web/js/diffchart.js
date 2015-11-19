var dcmargin = {top: 20, right: 20, bottom: 30, left: 50},
    dcwidth = window.innerWidth/2 - dcmargin.left - dcmargin.right,
    dcheight = window.innerHeight/2 - dcmargin.top - dcmargin.bottom;

var dcparseDate = d3.time.format("%d/%m/%y").parse;

var dcx = d3.time.scale()
    .range([0, dcwidth]);

var dcy = d3.scale.linear()
    .range([dcheight, 0]);

var dcxAxis = d3.svg.axis()
    .scale(dcx)
    .orient("bottom");

var dcyAxis = d3.svg.axis()
    .scale(dcy)
    .orient("left");

var dcline = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return dcx(d.date); })
    .y(function(d) { return dcy(d["Tmin"]); });

var dcarea = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return dcx(d.date); })
    .y1(function(d) { return dcy(d["Tmin"]); });

var dcsvg = d3.select("body").append("svg")
        .attr("class","dcsvg")
    .attr("width", dcwidth + dcmargin.left + dcmargin.right)
    .attr("height", dcheight + dcmargin.top + dcmargin.bottom)
  .append("g")
    .attr("transform", "translate(" + dcmargin.left + "," + dcmargin.top + ")");
//Get the Amount of alerts for tooltip
        var bisectDate = d3.bisector(function(d) {
            return d.date;
        }).left;
d3.csv("./data/weather.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.date = dcparseDate(d.date);
    d["Tmin"]= +d["Tmin"];
    d["Tmax"] = +d["Tmax"];
  });

  dcx.domain(d3.extent(data, function(d) { return d.date; }));

  dcy.domain([
    d3.min(data, function(d) { return Math.min(d["Tmin"]); }),
    d3.max(data, function(d) { return Math.max(d["Tmax"]); })
  ]);

  dcsvg.datum(data);
 
  dcsvg.append("clipPath")
      .attr("id", "dc-clip-below")
      .attr("class","dcarea")
    .append("path")
      .attr("d", dcarea.y0(dcheight))
      .attr("data-toggle", "tooltip")
      .attr("title", "toggle here");

  dcsvg.append("clipPath")
      .attr("id", "dc-clip-above")
      .attr("class", "dcarea")
    .append("path")
      .attr("d", dcarea.y0(0))
      .attr("data-toggle", "tooltip")
      .attr("title", "toggle here");

  dcsvg.append("path")
      .attr("class", "dc area above")
      .attr("clip-path", "url(#dc-clip-above)")
      .attr("d", dcarea.y0(function(d) { return dcy(d["Tmax"]); }))
      .attr("data-toggle", "tooltip")
      .attr("title", "toggle here");
    
  dcsvg.append("path")
      .attr("class", "dc area below")
      .attr("clip-path", "url(#clip-below)")
      .attr("d", dcarea)
      .attr("data-toggle", "tooltip")
      .attr("title", "toggle here");

  dcsvg.append("path")
      .attr("class", "dcline")
      .attr("d", dcline)
      .attr("data-toggle", "tooltip")
      .attr("title", "toggle here");

  dcsvg.append("g")
      .attr("class", "dc x axis")
      .attr("transform", "translate(0," + dcheight + ")")
      .call(dcxAxis);

  dcsvg.append("g")
      .attr("class", "dc y axis")
      .call(dcyAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature (ºF)");
      
     

});

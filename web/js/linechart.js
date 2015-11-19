//Line Graph
//Set the dimensions of the canvas / graph
var selectedMth = "All";
var selectedYr = "All";

var parseDate = d3.time.format("%d/%m/%y").parse;
var formatTime = d3.time.format("%d/%b/%y");
var margin = {top: 30, right: 20, bottom: 30, left: 50},
width = window.innerWidth / 2 - margin.left - margin.right,
        height = window.innerHeight / 3 - margin.top - margin.bottom;
// Set the ranges
var lcx = d3.time.scale().range([0, width]);
var lcy = d3.scale.linear().range([height, 0]);
//Define the axes
var lcxAxis = d3.svg.axis().scale(lcx)
        .orient("bottom").ticks(5);
var lcyAxis = d3.svg.axis().scale(lcy)
        .orient("left").ticks(5);
// Define the line
var valueline = d3.svg.line()
        .interpolate("basis")
        .x(function (d) {
            //console.log(d.date);
            return lcx(d.date);
        })
        .y(function (d) {
            //console.log(d.Tmin);
            return  lcy(d.Tmin);
        });
var valueline2 = d3.svg.line()
        .interpolate("basis")
        .x(function (d) {
            return lcx(d.date);
        })
        .y(function (d) {
            return lcy(d.Tmax);
        });

//Add the svg canvas
var lcsvg = d3.select("#linechart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," +
                margin.top + ")");

var lcdiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
var monthFormat = d3.time.format("%B");
var yrFormat = d3.time.format("%Y");

//Get the data
function drawLineGraph() {

    d3.csv("./data/weather.csv", function (error, data) {
        console.log(selectedMth);
        console.log(selectedYr);
        console.log(data);
        data.forEach(function (d) {

            d.date = parseDate(d.date);
            d.Tmin = +d.Tmin;
            d.Tmax = +d.Tmax;


        });
        if (selectedYr !== "All") {
            data = data.filter(function (d) {


                return yrFormat(d.date) === selectedYr;


            });
        }
        if (selectedMth !== "All") {
            data = data.filter(function (d) {
                return monthFormat(d.date) === selectedMth;
            });
        }


        console.log(data);
// Scale the range of the data
        lcx.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        lcy.domain([0, d3.max(data, function (d) {

                return Math.max(d.Tmin, d.Tmax);
            })]);
        //clear if there is any line
        lcsvg.selectAll(".line").remove();
        lcsvg.selectAll("circle").remove();
// Add the valueline path.
        lcsvg.append("path")
                .attr("class", "line")
                .attr("id","minline")
                .attr("d", valueline(data))
                .style("stroke", "#4183D7")
                .style("fill","none")
                .style("stroke-width",2);

        lcsvg.append("path")
                .attr("class", "line")
                .attr("id", "maxLine")
                .attr("d", valueline2(data))
                .style("stroke", "#F64747")
                .style("fill","none")
                .style("stroke-width",2);
        // draw the scatterplot
        lcsvg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 1.5)
                .style("fill", "steelblue")
// Made slightly larger to make recognition easier
                .attr("cx", function (d) {
                    return lcx(d.date);
                })
                .attr("cy", function (d) {
                    return lcy(d.Tmin);
                })
                .on("mouseover", function (d) {
                    lcdiv.transition()
                            .duration(200)
                            .style("opacity", .9);
                    lcdiv.html(formatTime(d.date) + "<br/>" + d.Tmin)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    lcdiv.transition()
                            .duration(500)
                            .style("opacity", 0);
                });
        lcsvg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 1.5)
                .style("fill", "#e74c3c")
// Made slightly larger to make recognition easier
                .attr("cx", function (d) {
                    return lcx(d.date);
                })
                .attr("cy", function (d) {
                    return lcy(d.Tmax);
                })
                .on("mouseover", function (d) {
                    lcdiv.transition()
                            .duration(200)
                            .style("opacity", .9);
                    lcdiv.html(formatTime(d.date) + "<br/>" + d.Tmax)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    lcdiv.transition()
                            .duration(500)
                            .style("opacity", 0);
                });

        lcsvg.selectAll("g").remove();
        lcsvg.selectAll(".axis-title").remove();

// Add the X Axis
        lcsvg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(lcxAxis);
        lcsvg.append("text")
                .attr("class", "axis-title")
                .attr("x", width / 2)
                .attr("y", height + margin.top)
                .style("text-anchor", "middle")
                .style("color", "black")
                .text("Date");

// Add the Y Axis
        lcsvg.append("g")
                .attr("class", "y axis")
                .call(lcyAxis);
        lcsvg.append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - height / 2)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Temperature");


    });
}


function updatelgData() {
    //get month data
    var mthddn = document.getElementById("mth_dropdown");
    selectedMth = mthddn.options[mthddn.selectedIndex].value;
    console.log(selectedMth);

    //get year data
    var yrddn = document.getElementById("yr_dropdown");
    selectedYr = yrddn.options[yrddn.selectedIndex].value;
    console.log(selectedYr);

    //redraw the graph
    drawLineGraph();
}

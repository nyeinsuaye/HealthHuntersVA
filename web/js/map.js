var selectedMth = "All";
var selectedYr = "All";

var monthFormat = d3.time.format("%B");
var yrFormat = d3.time.format("%Y");
var parseDate = d3.time.format("%d/%m/%y").parse;
function updateMapData() {
    //get month data
    var mthddn = document.getElementById("mth_dropdown");
    selectedMth = mthddn.options[mthddn.selectedIndex].value;
    console.log(selectedMth);

    //get year data
    var yrddn = document.getElementById("yr_dropdown");
    selectedYr = yrddn.options[yrddn.selectedIndex].value;
    console.log(selectedYr);
    $("#map").remove();
    var mapNode = document.createElement("div");
    mapNode.id = "map";

    $("body").append(mapNode);
    //redraw the graph
    drawMap();
}

function drawMap() {

    var map = new L.map('map').setView([41.8369, -87.6847], 10);

    // load a tile layer
    L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

// Base Chloropleth Map    
    $.getJSON("./data/zipcode.geojson", function (hoodData) {

        L.geoJson(hoodData, {
            style: function (feature) {
                var fillColor,
                        density = feature.properties.density;
                if (density > 80)
                    fillColor = "#006837";
                else if (density > 40)
                    fillColor = "#31a354";
                else if (density > 20)
                    fillColor = "#78c679";
                else if (density > 10)
                    fillColor = "#c2e699";
                else if (density > 0)
                    fillColor = "#ffffcc";
                else
                    fillColor = "#f7f7f7";  // no data
                return {color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6};
            },
            onEachFeature: function (feature, layer) {

                layer.bindPopup("<strong>" + feature.properties.Name + "</strong><br/>" + feature.properties.density + " mosquitoes per square mile")
            }
        }).addTo(map);
    });

// load GeoJSON from an external file
    /*
     $.getJSON("Chicago.geojson",function(data){
     var ratIcon = L.icon({
     iconUrl: 'Mosquito.png',
     iconSize: [40,30]
     });
     var chicago = L.geoJson(data,{
     pointToLayer: function(feature,latlng){
     var marker = L.marker(latlng,{icon: ratIcon});
     marker.bindPopup(feature.properties.Address + '<br/>' + feature.properties.Number_of_Mosquitoes);
     return marker;
     }
     });
     
     var clusters = L.markerClusterGroup();
     clusters.addLayer(chicago);
     map.addLayer(clusters);
     
     });
     */

//Circle Marker
    $.getJSON("./data/Chicago.geojson", function (data) {
        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var chicago = L.geoJson(data, {
            pointToLayer: function (feature, latlng) {

                var marker = L.circleMarker(latlng, geojsonMarkerOptions);
                //console.log(marker);
                marker.bindPopup('<b>Address: </b>' + feature.properties.Address + '<br/><b>Date: </b>' + feature.properties.Date + '<br/><b>Number of Mosquitos: </b>' + feature.properties["Number of Mosquitoes"]);
                return marker;
            },
            filter: function (feature, layer) {
                var yrtmp = yrFormat(parseDate(feature.properties.Date));
                var mthtmp = monthFormat(parseDate(feature.properties.Date));
                if (selectedYr !== "All") {
                    //console.log("i am here");
                    //console.log(yrFormat(parseDate(feature.properties.Date)));

                    if (selectedMth !== "All") {
                        if (selectedYr === yrtmp && selectedMth === mthtmp) {
                            return feature.properties.Date;
                        }
                    } else {
                        if (selectedYr === yrtmp) {
                            return feature.properties.Date;
                        }
                    }


                } else if (selectedMth !== "All") {
                    if (selectedMth === mthtmp) {
                        return feature.properties.Date;
                    }
                } else {
                    return feature.properties.Date;
                }
            }
        });

        var clusters = L.markerClusterGroup();
        clusters.addLayer(chicago);
        map.addLayer(clusters);

    });


}
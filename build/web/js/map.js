
var minDate;
var maxDate;

var dateFormat = d3.time.format("%d/%m/%Y");
var parseDate = d3.time.format("%d/%m/%y").parse;
var isoparseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;

function redrawMap(min, max) {

    minDate = new Date(isoparseDate(min));
    maxDate = new Date(isoparseDate(max));

    $("#map").remove();
    
    var mapNode = document.createElement("div");
    mapNode.id = "map";
    $(".container").append(mapNode);
    $("#map").attr("class","col-md-6 col-sm-6");
    drawMap();
}


function drawMap() {
    //console.log("gonna draw map");
    var map = new L.map('map').setView([41.8369, -87.6847], 10);


    // load a tile layer
    L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    $.getJSON("./data/zipcodewithdensity.geojson", function (hoodData) {

        var chloropleth = L.geoJson(hoodData, {
            style: function (feature) {
                var fillColor,
                        density = feature.properties.density;
                /*
                 // for 7 clusters if (density > 34000)
                                     fillColor = "#005824";
                                 else if (density > 30000)
                                     fillColor = "#238b45";
                                 else if (density > 23000)
                                     fillColor = "#41ae76";
                                 else if (density > 16000)
                                     fillColor = "#66c2a4";
                                 else if (density > 10000)
                                     fillColor = "#99d8c9";
                                 else if (density > 4000)
                                     fillColor = "#ccece6"; 
                                 else if (density > 195)
                                     fillColor = "#edf8fb";
                 
                                 //for 4 Clusters
                                 fillColor = "#005824";
                                 else if (density > 30000)
                                     fillColor = "#238b45b";
                                 else if (density > 16000)
                                     fillColor = "#66c2a4";
                                 else if (density > 10000)
                                     fillColor = "#b2e2e2";
                                 else if (density > 195)
                                     fillColor = "#edf8fb";
                 */

                if (density > 30000)
                    fillColor = "#006837";
                else if (density > 20000)
                    fillColor = "#31a354";
                else if (density > 15000)
                    fillColor = "#78c679";
                else if (density > 10000)
                    fillColor = "#c2e699";
                else if (density > 0)
                    fillColor = "#ffffcc";
                else
                    fillColor = "#f7f7f7";  // no data
                return {color: "#838383", weight: 1, fillColor: fillColor, fillOpacity: .7};
            },
            onEachFeature: function (feature, layer) {

                layer.bindPopup("<strong>Name: </strong>" + feature.properties.name + "<br/>" + "<strong>ZIP: </strong>" + feature.properties.ZIP + "</strong><br/>" + feature.properties.density + " people per square mile");
            }
        }).addTo(map);
        
        // get color depending on population density value
		function getColor(d) {
			return d > 30000 ? 	'#006837' :
			       d > 20000  ? '#31a354' :
			       d > 15000  ? '#78c679' :
			       d > 10000  ? '#c2e699' :
			                  	'#ffffcc';
		}

		//Add Legend
		var legend = L.control({position: 'bottomright'});
		legend.onAdd = function(map) {

	    var div = L.DomUtil.create('div', 'info legend'),
	        population = [0, 10000, 15000, 20000, 30000],
	        labels = [];

	    // loop through our density intervals and generate a label with a colored square for each interval
	    for (var i = 0; i < population.length; i++) {
	        div.innerHTML +=
	            '<i style="background:' + getColor(population[i] + 1) + '"></i> ' +
	            population[i] + (population[i + 1] ? '&ndash;' + population[i + 1] + '<br>' : '+');
	    }

	    return div;
		};

		legend.addTo(map);
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
        console.log("adding chicago geojson");
        var chicago = L.geoJson(data, {
            pointToLayer: function (feature, latlng) {

                var marker = L.circleMarker(latlng, geojsonMarkerOptions);
                marker.bindPopup('<b>Address: </b>' + feature.properties.Address + '<br/><b>Date: </b>' + feature.properties.Date + '<br/><b>Number of Mosquitos: </b>' + feature.properties["Number of Mosquitoes"]);
                return marker;
            },
            filter: function (feature, layer) {
                if (typeof minDate === 'object' && typeof maxDate === 'object') {
                    var tmp = new Date(feature.properties.Date);

                    if (tmp > minDate && tmp < maxDate) {
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
    //Add Heat Map
    var heat = L.heatLayer(quakePoints, {
        radius: 15,
        blur: 15,
        maxZoom: 17
    }).addTo(map);

//layer control
    var baseMaps = {
        "Heatmap": heat,
        "Clustermap": clusters
    };

    var overlayMaps = {
        "Chloropleth": chloropleth
    };
    L.control.layers(baseMaps, overlayMaps).addTo(map);

}
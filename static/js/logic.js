// Define the URL for fetching earthquake data from USGS
const earthquakeUSGSDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

// Create a Leaflet map with specified center and zoom level
var myMap = L.map("map").setView([38.70, -121.17], 6);

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Function to style earthquake markers based on depth
function styleEarthquake(feature) {
    return {
        fillOpacity: 1,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "black",
        radius: getRadius(feature.properties.mag),
        weight: 0.5,
        stroke: true,
    };
}

// Function to determine color based on depth
function getColor(depth) {
    if (depth < 10 && depth >= -10) {
        return "#b6d7a8";
    } else if (depth < 30 && depth >= 10) {
        return "#6aa84f";
    } else if (depth < 50 && depth >= 30) {
        return "#ffd966";
    } else if (depth < 70 && depth >= 50) {
        return "#f1c232";
    } else if (depth < 90 && depth >= 70) {
        return "#e06666";
    } else return "#990000";
}

// Function to determine marker radius based on magnitude
function getRadius(mag) {
    if (mag === 0) {
        return mag;
    } else if (mag > 1 && mag <= 8) {
        return mag * 5;
    } else if (mag > 8) {
        return mag * 11;
    }
    return mag * 12;
}

// Fetch earthquake data from the USGS API
fetch(earthquakeUSGSDataUrl)
    .then(response => response.json())
    .then(data => {
        // Add GeoJSON layer to the map
        L.geoJson(data, {
            // Create circle markers for each earthquake point
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng);
            },
            // Apply custom styling to each earthquake marker
            style: styleEarthquake,
            // Add popups with earthquake information to each marker
            onEachFeature: function (feature, layer) {
                layer.bindPopup("<b>Magnitude: </b>" + feature.properties.mag +
                    "<br><b>Location: </b> " + feature.properties.place + "<br><b>Depth: </b>" +
                    feature.geometry.coordinates[2]);
            }
        }).addTo(myMap);

        // Create legend control for depth ranges
        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'legend');
            var depthRanges = [-10, 10, 30, 50, 70, 90];

            div.innerHTML += "<h3 style='text-align: center'><b>Depth</b></h3>";

            // Add legend entries for each depth range
            for (var i = 0; i < depthRanges.length; i++) {
                var color = getColor(depthRanges[i]);
                var from = depthRanges[i];
                var to = depthRanges[i + 1];

                div.innerHTML +=
                    '<i style="background:' + color + '"></i> ' +
                    from + (to ? '&ndash;' + to + '<br>' : '+');
            }

            return div;
        };

        // Add legend to the map
        legend.addTo(myMap);
    })
    .catch(error => console.error('Error fetching earthquake data:', error));

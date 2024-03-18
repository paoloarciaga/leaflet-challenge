const earthquakeUSGSDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

var myMap = L.map("map", {
  center: [38.70, -121.17],
  zoom: 6,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

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

d3.json(earthquakeDataUrl).then(function (data) {
  L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
      },
      style: styleEarthquake,
      onEachFeature: function (feature, layer) {
          layer.bindPopup("<b>Magnitude: </b>" + feature.properties.mag +
              "<br><b>Location: </b> " + feature.properties.place + "<br><b>Depth: </b>" +
              feature.geometry.coordinates[2]);
      }
  }).addTo(myMap);

  
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'legend');
      var depthRanges = [-10, 10, 30, 50, 70, 90];
      var labels = [];

      div.innerHTML += "<h3 style='text-align: center'><b>Depth</b></h3>";

     
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

  legend.addTo(myMap);
});
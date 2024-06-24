let map = L.map("map", {
  center: [37.8, -96],
  zoom: 4
});

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the map
  //const map = L.map('map').setView([37.8, -96], 4);
  

  // Add OpenStreetMap TileLayer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);


// Define a function to scale marker size
function markerSize(magnitude) {
  return magnitude * 5;
}

// Define a function to get color based on depth
function getColor(depth) {
  return depth > 90 ? '#d73027' :
         depth > 70 ? '#fc8d59' :
         depth > 50 ? '#fee08b' :
         depth > 30 ? '#d9ef8b' :
         depth > 10 ? '#91cf60' :
                      '#1a9850';
}

// Fetch GeoJSON data using D3
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(data => {
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h4>Magnitude: ${feature.properties.mag}</h4><p>Location: ${feature.properties.place}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  }).addTo(map);
});

// Add a legend
const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  const depths = [-10, 10, 30, 50, 70, 90];
  const labels = [];

  // Generate a label with a colored square for each interval
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+');
  }

  return div;
};

legend.addTo(map);
});
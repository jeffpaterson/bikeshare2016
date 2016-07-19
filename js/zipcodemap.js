var colorUsers = {subscriber: "#0070cd", customer: "#bae4bc", total: "#7bccc4", extra:"#d1d1d1", alert: "#e63737", highlight:"#ff9c27"},
    colorFact = ["#9fc1ff","#bebada","#0072b9","#AF1E2C","#F2552C","#05535D","#fccde5","#d9d9d9","#bc80bd","#ccebc5"],
    colorCities = ["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0070cd"],
    colorHeat = ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081","#041a40"];

// Create the Google Map…
function initMap() {
  var map = new google.maps.Map(d3.select("#map-here").node(), {
    zoom: 10,
    center: new google.maps.LatLng(37.7, -122.3), // center on SF bay 
    styles: [{"featureType":"landscape","stylers":[{"saturation":-25},{"lightness":25},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-25},{"lightness":25},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-20},{"lightness":20},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-25},{"lightness":20},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":0},{"visibility":"on"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-10},{"saturation":0}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#6599FF"},{"lightness":0},{"saturation":0}]}],
    mapTypeId: google.maps.MapTypeId.MAP
  });

var colors = ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"];

// Load the data. When the data comes back, create an overlay.
// zip code mapping from http://greatdata.com/free-zip-code-database
d3.csv("data/zipcode_rides.csv", function(data) {
  var overlay = new google.maps.OverlayView();
     
    data.forEach(function(d) {
      d.rides = +d.rides;
  });
      
  var colorScale = d3.scale.threshold()
              //.domain([0, 9, d3.max(data, function (d) { return d.rides; })])
              .domain([50,100,200,400,600,1000,2000,8000])
              .range(colors);
  var radiusScale = d3.scale.threshold()
              .domain([50,100,200,400,600,1000,2000,8000])
              // .range([3,4,5,6,7,8,9,10]);  
              .range([5,6,7,8,9,10,11,12]);    
  
  
  // Add the container when the overlay is added to the map.
  overlay.onAdd = function() {
    var layer = d3.select(this.getPanes().overlayLayer).append("div")
        .attr("class", "overlay");
 
    // Draw each marker as a separate SVG element.
    // We could use a single SVG, but what size would it have?
    overlay.draw = function() {
      var projection = this.getProjection(),
          padding = 12;
 
      var marker = layer.selectAll("svg")
          .data(d3.entries(data))
          .each(transform) // update existing markers
          .enter().append("svg:svg")
          .each(transform)
          .attr("class", "marker");
 
      // Add a circle.
      marker.append("svg:circle")
          .attr("r", function(d){ return radiusScale(d.value.rides)})
          .style('opacity', 0.85)
          .attr("cx", padding)
          .attr("cy", padding-1)
          .attr('stroke','gray')
          .attr('fill', function(d){ return colorScale(d.value.rides)});
 
      // Add a label.
      marker.append("svg:text")
          .attr("x", padding + 7)
          .attr("y", padding)
          .attr("dy", ".5em")
          .attr("class", "label")
          .text(function(d) { return d.value.name; });
 
      function transform(d) {
        d = new google.maps.LatLng(d.value['lat'], d.value['lon']);
        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
      }
    };
  };
 
  // Bind our overlay to the map…
  overlay.setMap(map);
}); 



d3.csv("data/bart.csv", function(data) {
  var overlay = new google.maps.OverlayView();
 
  // Add the container when the overlay is added to the map.
  overlay.onAdd = function() {
    var layer = d3.select(this.getPanes().overlayLayer).append("div")
        .attr("class", "overlay");
 
    // Draw each marker as a separate SVG element.
    // We could use a single SVG, but what size would it have?
    overlay.draw = function() {
      var projection = this.getProjection(),
          padding = 10;
 
      var marker = layer.selectAll("svg")
          .data(d3.entries(data))
          .each(transform) // update existing markers
          .enter().append("svg:svg")
          .each(transform)
          .attr("class", "marker");
 
      // Add a circle.
      marker.append("svg:circle")
          .attr("r", 10)
          .attr('fill','blue')
          // .attr("cx", padding)
          // .attr("cy", padding);
 
      // Add a label.
      // marker.append("svg:text")
      //     .attr("x", padding + 7)
      //     .attr("y", padding)
      //     .attr("dy", ".5em")
      //     .attr("class", "label")
          //.text(function(d) { return d.value[2]; });
          // .text(function(d) { return d.value['name']; });
 
      function transform(d) {
        d = new google.maps.LatLng(d.value['lat'], d.value['lon']);
        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
      }
    };
  };
 
  // Bind our overlay to the map…
  overlay.setMap(map);
});


d3.csv("data/caltrain.csv", function(data) {
  var overlay = new google.maps.OverlayView();
 
  // Add the container when the overlay is added to the map.
  overlay.onAdd = function() {
    var layer = d3.select(this.getPanes().overlayLayer).append("div")
        .attr("class", "overlay");
 
    // Draw each marker as a separate SVG element.
    // We could use a single SVG, but what size would it have?
    overlay.draw = function() {
      var projection = this.getProjection(),
          padding = 10;
 
      var marker = layer.selectAll("svg")
          .data(d3.entries(data))
          .each(transform) // update existing markers
          .enter().append("svg:svg")
          .each(transform)
          .attr("class", "marker");
 
      // Add a circle.
      marker.append("svg:circle")
          .attr("r", 10)
          .attr('fill','green')
          // .attr("cx", padding)
          // .attr("cy", padding);
 
      // Add a label.
      // marker.append("svg:text")
      //     .attr("x", padding + 7)
      //     .attr("y", padding)
      //     .attr("dy", ".5em")
      //     .attr("class", "label")
          //.text(function(d) { return d.value[2]; });
          // .text(function(d) { return d.value['name']; });
 
      function transform(d) {
        d = new google.maps.LatLng(d.value['lat'], d.value['lon']);
        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
      }
    };
  };
 
  // Bind our overlay to the map…
  overlay.setMap(map);
});


};
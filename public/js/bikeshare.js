var map;
var markerOutline;
var bikeshareInfo;
var bikeshareInfoId = 1;
var markers = [];
var currentInfoWindow;
var locations = {'palo-alto': {lat: 37.4356, lng: -122.1553},
                 'sf': {lat: 37.7856, lng: -122.4213},
                 'mt-view' : {lat: 37.4003, lng: -122.0814},
                 'san-jose' : {lat: 37.3376, lng: -121.8896},
                  'region' : {lat: 37.4745, lng: -122.0302}
                  };

$( document ).ready(function() {
    updateBikeShareInfo();
    window.setInterval(updateBikeShareInfo,60000);
    $('.bikeshare-area').click((event) => {
        console.log(event);
        var locationId = $(event.toElement).attr("id");
        map.setCenter(locations[locationId]);
        if (locationId === 'region') {
            map.setZoom(10);
        } else {
            map.setZoom(14);
        }
    });
});

function initMap() {
    var mapOptions = {
        zoom: 14,
        zoomControl: true,
        scaleControl: true,
        scrollwheel: false,
        disableDoubleClickZoom: false,
        center: new google.maps.LatLng(37.7856, -122.4213),
        heading: 90, 
        styles: [{"featureType":"landscape","stylers":[{"saturation":-25},{"lightness":25},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-25},{"lightness":25},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-20},{"lightness":20},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-25},{"lightness":20},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":0},{"visibility":"on"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-10},{"saturation":0}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#6599FF"},{"lightness":0},{"saturation":0}]}],
        };
    var mapElement = document.getElementById('map');
    map = new google.maps.Map(mapElement, mapOptions);
}

function updateBikeShareInfo( ) {
    
// activate for live data feed
    $.getJSON( 'http://bikeshare2016.herokuapp.com/json',
    
// active for simulated data, from random static json files
    // var id = Math.floor(Math.random()*5 + 1);  
    // $.getJSON( "data/bikeshare" + id+".json", 
        
        function ( data ) {
            deleteMarkers();
            data.stationBeanList.forEach((station) => {
                var markerColor = "#1b8af9";
                var markerPath = {'plus' : "M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10" ,
                                    'fullCircle' : "M9.875,0.625C4.697,0.625,0.5,4.822,0.5,10s4.197,9.375,9.375,9.375S19.25,15.178,19.25,10S15.053,0.625,9.875,0.625",
                                    'emptyCircle' : "M10,0.562c-5.195,0-9.406,4.211-9.406,9.406c0,5.195,4.211,9.406,9.406,9.406c5.195,0,9.406-4.211,9.406-9.406C19.406,4.774,15.195,0.562,10,0.562 M10,18.521c-4.723,0-8.551-3.829-8.551-8.552S5.277,1.418,10,1.418s8.552,3.828,8.552,8.551S14.723,18.521,10,18.521",
                                    'halfCircle' : 'M10,0.625c-5.178,0-9.375,4.197-9.375,9.375S4.822,19.375,10,19.375s9.375-4.197,9.375-9.375S15.178,0.625,10,0.625 M10,18.522V1.478c4.707,0,8.522,3.815,8.522,8.522S14.707,18.522,10,18.522',
                                    'oneQtrCircle' : 'M10,0.5c-5.247,0-9.5,4.253-9.5,9.5c0,5.246,4.253,9.5,9.5,9.5c5.246,0,9.5-4.254,9.5-9.5C19.5,4.753,15.246,0.5,10,0.5 M10,18.637c-0.372,0-0.735-0.031-1.094-0.077C6.9,16.278,5.682,13.275,5.682,10c0-3.276,1.219-6.278,3.224-8.56C9.265,1.395,9.628,1.364,10,1.364c4.771,0,8.637,3.867,8.637,8.636C18.637,14.771,14.771,18.637,10,18.637',
                                    'threeQtrCircle' : 'M10,0.375c-5.229,0-9.469,4.239-9.469,9.469S4.771,19.312,10,19.312s9.469-4.239,9.469-9.469S15.229,0.375,10,0.375 M11.079,18.377c2.005-2.275,3.225-5.262,3.225-8.533c0-3.272-1.22-6.258-3.225-8.533c4.243,0.531,7.529,4.145,7.529,8.533C18.608,14.232,15.322,17.846,11.079,18.377', 
                                };
                
                // set shape based on number of bikes available

                if (station.availableBikes >= 12){
                    markerOutline = markerPath.fullCircle;
                }                
                else if (station.availableBikes < 12 && station.availableBikes > 7 ){
                    markerOutline = markerPath.threeQtrCircle;
                }                
                else if (station.availableBikes <=7 && station.availableBikes > 4 ){
                    markerOutline = markerPath.halfCircle;
                } 
                else if (station.availableBikes <=4 && station.availableBikes > 2) {
                    markerOutline = markerPath.oneQtrCircle;
                } 
                else if (station.availableBikes === 2 || station.availableBikes === 1) {
                    markerOutline = markerPath.oneQtrCircle;
                    markerColor = '#f7f742';
                }
                else {
                    markerOutline = markerPath.emptyCircle;
                    markerColor = '#e57291';
                }

                // set shape to red full circle if no bike docks available 

                if (station.availableDocks < 1) {
                    markerColor = '#b39ee2';
                    markerOutline = markerPath.fullCircle
                }
                
                var stationContent = "<div id='map-info'><h4>" + 
                    station.stationName + "</h4><br/>Available Bikes: <strong>" + 
                    station.availableBikes + "</strong><br/> Open racks: <strong>"+
                    station.availableDocks + "</strong><br/> Station "+ 
                    station.statusValue+"</div>";

                var stationTitle = station.stationName + " (" + station.availableBikes +
                     " bikes | " + station.availableDocks + " open racks)";
                
                addMarker({lat: station.latitude, lng: station.longitude},
                    stationTitle,stationContent,markerOutline, markerColor);

            })
        });
}

 

// Adds a marker to the map and push to the array.
function addMarker(location, title,content, markerOutline, markerColor) {
    var infowindow = new google.maps.InfoWindow({
                    content: content,
                    maxWidth: 150
                    });
    var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: title,
            icon: {
                path: markerOutline,
                fillColor: markerColor,
                fillOpacity: .8,
                scale: 2,
                strokeColor: '#8c8c8c',
                strokeWeight: 1
            }
        });
    marker.setMap(map);
    marker.addListener('click', function() {
        if (typeof(currentInfoWindow) != "undefined" && currentInfoWindow !== null) {
            currentInfoWindow.close();
        }
        infowindow.open(map, marker); 
        currentInfoWindow = infowindow;                   
    });

       
    markers.push(marker);

}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    setMapOnAll(null);
    markers = [];
}

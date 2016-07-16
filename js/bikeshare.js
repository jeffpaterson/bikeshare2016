var map;
var bikeshareInfo;
var bikeshareInfoId = 1;
var locations = {'palo-alto': {lat: 37.4435, lng: -122.1639 },
                 'sf': {lat: 37.7912, lng: -122.4063 },
                 'mt-view' : {lat: 37.3913, lng: -122.0804 },
                 'san-jose' : {lat: 37.3376, lng: -121.8896 }
                  };

$( document ).ready(function() {
    window.setInterval(updateBikeShareInfo,9000);
    $('.bikeshare-area').click((event) => {
       map.setCenter(locations[$(event.toElement).attr("id")]);
    });
});

function initMap() {
    var mapOptions = {
        zoom: 14,
        zoomControl: true,
        scaleControl: true,
        scrollwheel: false,
        disableDoubleClickZoom: false,
        center: new google.maps.LatLng(37.7912, -122.4063), 
        styles: [{"featureType":"landscape","stylers":[{"saturation":-25},{"lightness":25},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-25},{"lightness":25},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-20},{"lightness":20},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-25},{"lightness":20},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":0},{"visibility":"on"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-10},{"saturation":0}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#6599FF"},{"lightness":0},{"saturation":0}]}],
        };
    var mapElement = document.getElementById('map');
    map = new google.maps.Map(mapElement, mapOptions);
}

function updateBikeShareInfo() {
    var id = Math.floor(Math.random()*5 + 1);
    console.log(id);
    $.getJSON( "bikeshare" + id+".json", 
        function( data ) {
            data.stationBeanList.forEach((station) => {
                var markerColor = 'green';
                if (station.availableBikes < 6 && station.availableBikes>0){
                    markerColor = 'yellow'
                } else if (station.availableBikes < 1) {
                    markerColor = 'red';
                }
                var stationContent = "<strong>" + 
                        station.stationName + "</strong><br/>Available Bikes: <strong>" + 
                        station.availableBikes + "</strong><br/> Open racks: <strong>"+
                        station.availableDocks + "</strong><br/> Station "+ 
                        station.statusValue;

                 var infowindow = new google.maps.InfoWindow({
                    content: stationContent
                    });
                
                var markerPath = "M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10";


                var marker = new google.maps.Marker({
                    position: {lat: station.latitude, lng: station.longitude},
                    map: map,
                    //title: station.stationName,
                    title: station.stationName + " ("+
                    station.availableBikes+" bikes | "+station.availableDocks+" open racks)",
                    icon: {
                        path: markerPath,
                        fillColor: 'black',
                        fillOpacity: 0.8,
                        scale: 2,
                        strokeColor: markerColor,
                        strokeWeight: 3
                    }
                });
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
            });
        });
}
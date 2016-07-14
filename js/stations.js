	/* This file creates the Station Map
	 * It uses jQuery selecting methods to allow the whole script to run and grab the station data from the server via jQuery.get()
	 */
	
	$(function()
	{
		var show_live_data = true;
		var show_planned_data = true;
		var planned_phases_to_show = [2]; // this is an array. use [1,2] for more
		var use_preset_zoom_center = true;
		
		var center = new google.maps.LatLng(37.790,-122.4183);
	
		// Set Map Options
		var mapOptions = {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
			zoom: 14,
			center: center
		};
		
		// Create the Google Map
		var map = new google.maps.Map(document.getElementById("station-map"), mapOptions);
		
		//Arrays to keep all the planned and soon markers, to easily toggle them off 
		var plannedMarkers = [];

		// Create the Popup Window when a user clicks on a station
		var station_infowindow = new google.maps.InfoWindow({
		});		
		
		/* Get Stations
	  	 * Displays all of the stations as points on the map
	  	 * 
			{
			    "executionTime": "2012-11-12 10:57:05 AM",
			    "stationBeanList": [
			        {
			            "location": "PBSC",
			            "id": 1375,
			            "uaid": "0000112",
			            "city": "",
			            "latitude": 40.755467,
			            "longitude": -73.986536,
			            "altitude": "",
			            "stationName": "Test PBS 1",
			            "postalCode": "",
			            "stAddress1": "Montreal",
			            "stAddress2": "",
			            "testStation": false,
			            "availableBikes": 7,
			            "availableDocks": 25,
			            "totalDocks": 32,
			            "statusValue": "In Service",
			            "statusKey": 1,
			            "landMark": "PBSC",
			            "lastCommunicationTime": "2012-11-12 10:02:56 AM"
			        },
			        ...
	
		 *
	  	 * return void
	  	 * author danielgohlke
	  	*/
		function get_stations() 
		{
			// Create a new instance of LatLngBounds to use for re-centering the map after all the stations are loaded
			var bounds = new google.maps.LatLngBounds();
			
			if (show_live_data)
			{
				// use jQuery.getJSON() to get the JSON file containing all the station information
		        $.getJSON("/stations/json/", function(json)
		        {        
					// Iterate through each station
					$.each(json.stationBeanList, function(i, station) {
		
						// Change the icon based on its json status
						if (station.statusValue == 'Planned')
						{
							icon = '/assets/images/bayarea/icons/stations/map-icon-planned.png';
						}
						else if (station.statusValue == 'In Service')
						{
							var icon = new google.maps.MarkerImage(
								'/assets/images/bayarea/icons/stations/map-icons.png',
								new google.maps.Size(42,53),
								new google.maps.Point(0,sprite_offset(station.availableBikes,station.availableDocks)),
								new google.maps.Point(22,53)
							);
						}
						else
						{
							icon = '/assets/images/bayarea/icons/stations/map-icon-outofservice.png';
						}
						
						// Check for valid Lat (-90 to 90) and long (-180 to 180) and ignore 0,0	
						valid_lat_long = (station.latitude!= 0 &&  station.latitude >= -90 && station.latitude <= 90 &&  
									station.longitude!= 0 &&  station.longitude >= -180 && station.longitude <= 180)
		
						//omit the stations with bogus lat/long or 0 lat and long 
						if (valid_lat_long    ) {
		
							// Create a Google LatLng object to pass to the Google Marker
							var point = new google.maps.LatLng(station.latitude, station.longitude);
		
							// Create the Google Marker Point with the LatLng object
							var marker = new google.maps.Marker({
								position : point,
								map : map,
								icon : icon,
								title : station.stationName
							});
		
							// Create an Event Listener that pops up the infoWindow when a user clicks a station
							google.maps.event.addListener(marker, 'click', function() {
									contentString='<div class="station-window">' +
													// Sets a temporary padding, this helps the station name stay on all one line. Google maps doesn't like the text-transform:uppercase without this
													'<h2 class="temp-padding" style="padding-right: 1.5em">' + station.stationName + '</h2>' +
														//if the station is planned, put up a small message saying it is planned, if not, put the table up
														(station.statusValue == 'Planned' ?	"<i>(planned station)</i>" :
														    //if we have don't have sponsorship info:....
															'<div class="station-data">' +
																'<table id="station-table">' + 
																	'<tr><th>Available Bikes:</th><td>' + station.availableBikes + '</td></tr>' +
																	'<tr><th>Available Docks:</th><td>' + station.availableDocks + '</td></tr>' +
																'</table>'	+
															'</div>'
														) +
													'</div>';
		
								// This code helps prevent scroll-bars. Create an element, put the content in the element, then put the element in the window (below)
								var div = document.createElement('div');
								div.innerHTML = contentString;
		
								// Set the content in the infowindow
								station_infowindow.setContent(div);
		
								// Open the InfoWindow
								station_infowindow.open(map, marker);
		
								// Create an event listener that runs when the infowindow is fully popped-up. This is so we can reset the margins
								google.maps.event.addListener(station_infowindow, 'domready', function() {
									// Resets the h2 padding back to zero
									$('.temp-padding').css('padding-right', '0');
		
									// Get the height of the table, to base the margin of the image and the table off of one another
									var table_height = $('#station-table').height();
		
									// Set the top margin of the table to a relative value of the image size, if the table is smaller than the image
									var table_margin = ($('.sponsor-img').attr("height") - table_height) / 2;
									table_margin = Math.max(table_margin, 0);
									$('.station-data-w-table').css('margin-top', table_margin);
		
									// Set the top margin of the image to a relative value of the table size, if the image is smaller than the table
									var img_margin = (table_height - $('.sponsor-img').attr("height")) / 2;
									img_margin = Math.max(img_margin, 0);
									$('.sponsor-img').css('margin-top', img_margin);
								});
								// End of infowindow domready event listener
							});
							// End of google map marker click event listener
							bounds.extend(point);
		
						} //end of hard-coded station omission
					});
					// End of $.each() json station
		
					// Reset the center of the map to the station coordinates and zoom to the bounds
					if (!use_preset_zoom_center) 
						map.setCenter(bounds.getCenter(), map.fitBounds(bounds));
			    }); //end of getJSON()
	
			} //end of if(show_live_data)
	
	
			if (show_planned_data)
			{
	
				// use jQuery.getJSON() to get the JSON file containing all the station information
		        $.getJSON("/assets/js/bayarea/planned-stations.json", function(json)
		        {        
					// Iterate through each station
					$.each(json, function(i, station) {
						
						if (planned_phases_to_show.indexOf(station.phase) > -1) {
							icon = '/assets/images/bayarea/icons/stations/map-icon-planned.png';
						
							// Create a Google LatLng object to pass to the Google Marker
							var point = new google.maps.LatLng(station.lat, station.lon);
			
							// Create the Google Marker Point with the LatLng object
							var marker = new google.maps.Marker({
								position : point,
								map : map,
								icon : icon,
								title : station.webname
							});
							
							if (station.docks == 0)
								station.docks = "TBD"
			
							plannedMarkers.push(marker);

							// Create an Event Listener that pops up the infoWindow when a user clicks a station
							google.maps.event.addListener(marker, 'click', function() {
									contentString='<div class="station-window">' +
													// Sets a temporary padding, this helps the station name stay on all one line. Google maps doesn't like the text-transform:uppercase without this
													'<h2 class="temp-padding" style="padding-right: 1.5em">' + station.webname + '</h2>' +
														'<i>(planned station)</i></div>';
									// This code helps prevent scroll-bars. Create an element, put the content in the element, then put the element in the window (below)
								var div = document.createElement('div');
								div.innerHTML = contentString;
									// Set the content in the infowindow
								station_infowindow.setContent(div);
									// Open the InfoWindow
								station_infowindow.open(map, marker);
									// Create an event listener that runs when the infowindow is fully popped-up. This is so we can reset the margins
								google.maps.event.addListener(station_infowindow, 'domready', function() {
									// Resets the h2 padding back to zero
									$('.temp-padding').css('padding-right', '0');
										// Get the height of the table, to base the margin of the image and the table off of one another
									var table_height = $('#station-table').height();
										// Set the top margin of the table to a relative value of the image size, if the table is smaller than the image
									var table_margin = ($('.sponsor-img').attr("height") - table_height) / 2;
									table_margin = Math.max(table_margin, 0);
									$('.station-data-w-table').css('margin-top', table_margin);
			
									// Set the top margin of the image to a relative value of the table size, if the image is smaller than the table
									var img_margin = (table_height - $('.sponsor-img').attr("height")) / 2;
									img_margin = Math.max(img_margin, 0);
									$('.sponsor-img').css('margin-top', img_margin);
								});
								// End of infowindow domready event listener
							});
							// End of google map marker click event listener
							bounds.extend(point);
							
						}
		
					});
					// End of $.each() json station
		
					// Reset the center of the map to the station coordinates and zoom to the bounds
					if (!use_preset_zoom_center) 
						map.setCenter(bounds.getCenter(), map.fitBounds(bounds));
			    }); //end of getJSON()
				
			} //end of if(show_planned_data)
	
		} // End of get_stations()			
	
		// Call the get_station_sponsors() method defined directly above to place the pins on the map
		get_stations();
		
		/* 
		*  show/hide Planned Stations
		*/
		$('.planned').click(function()
		{
			for (var i = 0; i < plannedMarkers.length; i++ ) 
			{
		 		if (plannedMarkers[i].getVisible()) 
		  		{
			    	plannedMarkers[i].setVisible(false);
	  			}
		    	else
		    	{
		    		plannedMarkers[i].setVisible(true);
			    }
			}
		});

		/*
		 * Pan Button Event Handlers
		 * 
		 */
		$('#sf.button').click(function(){
			panToLocation(37.790,-122.4183)
		});
		
		$('#redwoodcity.button').click(function(){
			panToLocation(37.486301,-122.237377);
		});
		
		$('#paloalto.button').click(function(){
			panToLocation(37.44747,-122.166281);
		});
		
		$('#mountainview.button').click(function(){
			panToLocation(37.395255,-122.078762);
		});
		
		$('#sanjose.button').click(function(){
			panToLocation(37.336316,-121.893339);
		});

       /* if( $('#content.stations').length > 0 ) {
            resizeMapToFit();

            $(window).on('resize', resizeMapToFit);
        }*/


		/* Pan To Location
	  	 * Pans the map to the specified lat/long
	  	 * 
	  	 * @param lat
	  	 * @param lng
	  	 * 
	  	 */
		function panToLocation(lat, lng)
		{
			// Create a Lat/Long Object
			var latLng = new google.maps.LatLng(lat, lng);
			
			// Pan To the Lat/Long 
      		map.panTo(latLng);
		}

		/* sprite_offset
	  	 * This function helps display different pins baased on station bike/dock availability
	  	 * 0 is 0% shaded (empty), 1 is 25% shaded, 2 is 50% shaded, 3 is 75% shaded, 4 is 100% shaded (full), 5 is all grey "not in service"
	  	 * 
	  	 * @param bikes
	  	 * @param docks
	  	 * 
	  	 */
		function sprite_offset(bikes,docks) {
			var index_offset=11;  
	
			// Only if the station is not reporting 0 bikes and 0 docks
		    if (!(bikes==0 && docks==0)) 
		    {
		        var percent=Math.round(bikes/(bikes+docks)*100);
	
				// Use the empty icon only for empty stations, ditto for full. Anything in-between, show different icon
				 if (percent==0)
			    	index_offset=0;
				else if (percent>0 && percent<=20)
			    	index_offset=2;
			    else if (percent>20 && percent<=30)
			    	index_offset=3;
			    else if (percent>30 && percent<=40)
			    	index_offset=4;
			    else if (percent>40 && percent<=50)
			    	index_offset=5;
			    else if (percent>50 && percent<=60)
			    	index_offset=6;
			    else if (percent>60 && percent<=70)
			    	index_offset=7;
			    else if (percent>70 && percent<=80)
			    	index_offset=8;
			    else if (percent>80 && percent<100)
			    	index_offset=9;
			    else if (percent==100)
			    	index_offset=10;
		    }
	
		    var offset=index_offset*(53+50); //53 the height of the pin portion of the image, 50 the whitespace b/t the pin portions
		    return offset;
		}
        /**
         * Make the map container sit in the remaining browser space
         

        function resizeMapToFit() {

            var $window = $(window);
            var elementHeight = 0;

            elementHeight += $('#header:visible, #mobile-nav:visible').height();
            elementHeight +=  $('#legend').height() + 50;
            elementHeight +=  $('#cities').height();
            elementHeight +=  $('#footer').height();

            $('#station-map').width($window.width()).height($window.height() - elementHeight);

        }*/


	});
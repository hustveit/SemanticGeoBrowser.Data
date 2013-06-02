function initialize() {
	
	console.debug("#1. START");
	dojo.when(
		initializeMap(),
		function(map_center_location) {
			var map_center_lat = map_center_location.Ya;
			var map_center_lng = map_center_location.Za;
			console.debug("#1. END");
			
	console.debug("#2. START");
	dojo.when(
		get_yr_uri(
			map_center_lat,
			map_center_lng
		),
		function(yr_uri) {
			console.debug(yr_uri);
			console.debug("#2. END");
			
	console.debug("#3. START");
	dojo.when(
		get_yr_weather(yr_uri),
		function(yr_weather) {
			console.debug(yr_weather);
			console.debug("#3. END");
			
			//sidebar-weather-box
		}
	); //END dojo.when() #3.
		}
	); //END dojo.when() #2.
		}
	); //END dojo.when() #1.
	
} //END initialize()

/**
 * Initialize the map (Google Maps API v3)
 */
function initializeMap() {
	var initializeMap_deferred = new dojo.Deferred();
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(65.586185,12.875977);
    var myOptions = {
      zoom: 4,
      center: latlng,
	  scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("sognefjord-banner"), myOptions);
	
	//Sette hike polyline inn i google kart
	var decoded_polyline = google.maps.geometry.encoding.decodePath(encoded_polyline);
	
	var setRegion = new google.maps.Polyline({
		path: decoded_polyline,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 2,
		map: map
	});
	
	// Fokuser kartet på utvalgt tur-sti (focus and zoom).
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < decoded_polyline.length; i++) {
		bounds.extend(decoded_polyline[i]);
	}
	var map_center_location = bounds.getCenter();
	map.fitBounds(bounds);
	initializeMap_deferred.resolve(map_center_location);
	return initializeMap_deferred;
} //END


function get_yr_uri(
	map_center_lat,
	map_center_lng
){
	var get_yr_uri_deferred = new dojo.Deferred();
	
	//Query drupal database
	dojo.xhrGet({ //HTTP POST REQUEST
		url: "../get_yr_weather_uri.php",
		content: {
			map_center_lat: map_center_lat,
			map_center_lng: map_center_lng
		},
		handleAs: "text",
		handle: function(response, ioArgs) { // The callback that fires regardless of request success or failure.
			return response;
		}
	}).then(function(yr_uri){ //true if gpx file is saved, false if not.
		get_yr_uri_deferred.resolve(yr_uri);
	});
	
	return get_yr_uri_deferred;
} //END


function get_yr_weather(yr_uri){
	var get_yr_weather_deferred = new dojo.Deferred();
	
	var test_uri = escape("http://www.yr.no/place/Norway/Hordaland/Bergen/Sandviken~2319041");
	
	//Query drupal database
	dojo.xhrGet({ //HTTP POST REQUEST
		url: "../yr2/yr2.php",
		content: {
			uri: test_uri
		},
		handleAs: "text",
		handle: function(response, ioArgs) { // The callback that fires regardless of request success or failure.
			return response;
		}
	}).then(function(yr_weather_html){ //true if gpx file is saved, false if not.
		var yr_weather_box = document.getElementById('sidebar-weather-box');
		yr_weather_box.innerHTML = yr_weather_html;
		get_yr_weather_deferred.resolve(yr_weather_html);
	});
	
	return get_yr_weather_deferred;
} //END

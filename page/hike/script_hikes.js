var map;
var markers = new Array();
var infoWindowArray = new Array();
var mouselocation = new google.maps.LatLng(20.715015145512098, 81.73828125);
var zoom_map_on_the_result = new google.maps.LatLngBounds();
var result_count = 0;

//form input
var duration_min_input = "";
var duration_max_input = "";
var length_min_input = "";
var length_max_input = "";

function initialize() {
	
	console.debug("#1. START");
	dojo.when(
		initializeMap(),
		function(latlng) {
			console.debug("#1. END");
			
	console.debug("#2. START");
	
	dojo.when(
		sognefjord_hike_query(),
		function(hike_query) {
			console.debug(hike_query);
			console.debug("#2. END");
	
	console.debug("#3. START");
	dojo.when(
		read_cross_domain_data(
			hike_query, 
			"get_all_hikes"
		),
		function(endpoint_reply) {
			console.debug(endpoint_reply);
			console.debug("#3. END");
			
	console.debug("#4. START");
	dojo.when(
		put_hikes_on_the_map(endpoint_reply),
		function(put_hikes_on_the_map_reply) {
			console.debug(put_hikes_on_the_map_reply);
			console.debug("#4. END");
		}
	); //END dojo.when() #4.
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
      mapTypeId: google.maps.MapTypeId.TERRAIN //MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("sognefjord-banner"), myOptions);
	
	// set a mousemove event for the map
	google.maps.event.addListener(map, 'mousemove', function(event) {
		mouselocation = event.latLng;
	});
	
	initializeMap_deferred.resolve(latlng);
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
	}).then(function(yr_uri){ //true if gpx file is saved, false if not.
		get_yr_weather_deferred.resolve(yr_uri);
	});
	
	return get_yr_weather_deferred;
} //END

/**
	Hentar alle ting frå Sognefjord sin SPARQL Endpoint
*/
function get_sognefjord_things(	duration_min_input,
								duration_max_input,
								length_min_input,
								length_max_input) {
	
	//input i query - kva søkekriteria har du?
	//duration_input

	//hentar SPARQL queries
	var hike_query = sognefjord_hike_query(	duration_min_input,
											duration_max_input,
											length_min_input,
											length_max_input); //Lagar query som tek høgde for søkekriteria.
	
	read_cross_domain_data(hike_query, "get_hike");
}


/**
 * Lars
 * Sends cross domain request using Dojo. Call-back method is defined here.
 */
function read_cross_domain_data(url, type) {
	var read_cross_domain_data_deferred = new dojo.Deferred();
	
	if(type == "get_all_hikes") {
	
		//old: fetch_from_hike_query
		dojo.io.script.get({
			callbackParamName: "callback",
			url: url,
			handleAs: "json",
			load: function(endpoint_reply){
				read_cross_domain_data_deferred.resolve(endpoint_reply);
			}
		});
	}
	
	//if type true, then use ...()
	if(type == "for_each_hike_do_this") {
		
		var escaped_query_url = url[0];
		var	hike_uri = url[1];
		var hike_uri_name = url[2];
		
		//old: for_each_hike_do_this
		dojo.io.script.get({
			callbackParamName: "callback",
			url: escaped_query_url,
			handleAs: "json",
			load: function(endpoint_reply){
			
				//todo: when.. put on map
				console.debug(endpoint_reply);
				
				dojo.when(
					put_this_hike_on_the_map(
						endpoint_reply,
						hike_uri,
						hike_uri_name
					),
					function(put_this_hike_on_the_map_reply) {
						//console.debug(put_this_hike_on_the_map_reply);
						
						read_cross_domain_data_deferred.resolve(endpoint_reply);
					}
				); //END dojo.when()
				
				
				
				
				
				
			}
		});
	}
	
	return read_cross_domain_data_deferred;
} //END..


/**
 * Method is a call-back method for request sent by readCrossDomainData()
 
 Her får me lista over ting.
 
 */
function fetch_from_hike_query(val){
		//alert("fetch_from_hike_query");
		
		/*
		//Testar her!
		read_cross_domain_data(sognefjord_get_one_selected_hike_query("http://data.sognefjord.vestforsk.no/resource/ontology#hike37"), "for_each_hike_do_this"); //heiii
		*/
		
		var image = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|FF0000|000000';
		var layerName = 'Hike';
		layers.add(layerName, []); //Lagar layer Hike her!

		if (val.results.bindings.length > 0){
			//alert("Talet på resultat er " + val.results.bindings.length);
			

			
			//TODO: Opprett eit layer i eit tre her...
			
			
			//kanskje bedre å sette dette inn i eit dojo tre.............
			//Resultatet vert her satt i ei liste i ein div
			var the_result_in_a_list = document.getElementById("result_items"); //id til <div> der du vil vise resultatet
			var list = document.createElement("ul");
			the_result_in_a_list.appendChild(list);
			
			//For kvar ting / resultatnode...
			dojo.forEach(val.results.bindings, function(entry, i){
			
				//set resultat i variablar
				var hike_uri = entry.thing_uri.value;
				var hike_uri_name = entry.thing_uri_name.value;
				//TODO: Hent inn fleire verdiar
				var hike_path = "";
				//var hike_path = read_cross_domain_data(sognefjord_hike_path_query(hike_uri_name), "get_hike_path"); //heiii
				
				//Set resultatet i ei liste TEST
				var text = hike_uri + ", " + hike_uri_name + ", " + hike_path;
				var listitem = document.createElement("li");
				var item = document.createTextNode(text);
				list.appendChild(listitem);
				listitem.appendChild(item);
				
				
				//TODO: Hent hike sin google encoded path
				read_cross_domain_data(sognefjord_get_one_selected_hike_query(hike_uri_name), "for_each_hike_do_this");
				
				
				
				
				//TODO: Set hike sin path i ein eigen layer
				
				
				
				
				
			}); //END - dojo.forEach()
			

		} //END if
		
		
} //END fetch_from_hike_query()

/**
 * Lars
 * Method is a call-back method for request sent by readCrossDomainData()
 */
function for_each_hike_do_this(val){
	//alert("for_each_hike_do_this");
	
	if (val.results.bindings.length > 0){
	
		//For kvar ting / resultatnode... (Her skal me i grunn berre få ein ting
		dojo.forEach(val.results.bindings, function(entry, i){
		
			//set resultat i variablar
			//var hike_uri = entry.thing_uri.value;
			//var hike_uri_name = entry.thing_uri_name.value;
			
			var hike_duration = entry.hike_duration.value;
			var hike_length = entry.hike_length.value;
			var hike_difficulty = entry.hike_difficulty.value;
			var google_encoded_polyline = entry.hike_google_encoded_path.value;
			var hike_same_as = entry.hike_same_as.value;
			var hike_type = entry.hike_type.value;
			//TODO: Hent inn fleire verdiar, t.d. titel til turen
			
			var layer_name = "Hike";
			
			//Sette hike polyline inn i google kart
			var decoded_polyline = google.maps.geometry.encoding.decodePath(google_encoded_polyline);
			
			var setRegion = new google.maps.Polyline({
				path: decoded_polyline,
				strokeColor: "#FF0000",
				strokeOpacity: 1.0,
				strokeWeight: 2,
				map: map
			});
			
			//Alt google map info vert satt i layer "Hike"
			//layers.entry("Gravemeldinger").value.push(setRegion);
			layers.entry("Hike").value.push(setRegion);
			

			
			
			
			
			
			/* TODO:Sett info i infoboks og add ein listener ved trykk på polyline
			//layers.entry(layerName).value.push(setRegion);
			
			
			var text = hike_duration;
			var contentString = '<div style="width: 70px">hike_duration: ' + text + '</div>';
			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			

			google.maps.event.addListener(setRegion, 'click', function() {
				closeAllInfowindows();
				openInfowindowsArray.push(infowindow);
				infowindow.open(map,setRegion);
			});
			*/
			
			
			//TODO: Sette info inn i dojo tre (som ikkje er oppretta endå)
			
			
			
			
			}); //END - dojo.forEach()
	
	} //END if
} //END ...()

/**
	Hentar ut google encoded path til ein aktuell hike.
	Dette fordi:
	Store svar kan fort overgå Virtuoso sine grenser på mengde tekst.
	Input: hike_uri
*/
function sognefjord_get_one_selected_hike_query(hike_uri_name) {
	var sognefjord_get_one_selected_hike_query_deferred = new dojo.Deferred();
	
	/* Old - From before 2012.01.19
	var query = "PREFIX sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> \
	\
	SELECT DISTINCT ?hike_path \
	WHERE { \
		GRAPH <http://data.sognefjord.vestforsk.no/resource/hike> { \
			OPTIONAL { <"+ hike_uri_name +">		sf_ont:Path					?blank_path_node }. \
			OPTIONAL { ?blank_path_node		sf_ont:Google_encoded_path	?hike_path }. \
		} \
	} \
	LIMIT 1";
	*/
	
	//Query used from 19.01.2012
	var query = " \
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
	PREFIX sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> \
	PREFIX owl: <http://www.w3.org/2002/07/owl#> \
	PREFIX owl-time: <http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#> \
	PREFIX dct: <http://purl.org/dc/terms/> \
	 \
	SELECT DISTINCT \
		?hike_duration \
		?hike_length \
		?hike_difficulty \
		?hike_google_encoded_path \
		?hike_same_as \
		?hike_type \
		?hike_title \
		?hike_ingress \
	WHERE { \
		GRAPH <http://data.sognefjord.vestforsk.no/resource/hike> { \
			<"+ hike_uri_name +">				rdf:type						?hike_type . \
			OPTIONAL { <"+ hike_uri_name +">	owl-time:duration				?blank_duration_node }. \
			OPTIONAL { <"+ hike_uri_name +">	sf_ont:Length					?blank_length_node }. \
			OPTIONAL { <"+ hike_uri_name +">	sf_ont:degree_of_difficulty		?hike_difficulty }. \
			OPTIONAL { <"+ hike_uri_name +">	sf_ont:Path						?blank_path_node }. \
			OPTIONAL { <"+ hike_uri_name +">	owl:sameAs						?hike_same_as }. \
			 \
			OPTIONAL { ?blank_duration_node		owl-time:minute					?hike_duration }. \
			OPTIONAL { ?blank_length_node		sf_ont:Kilometer				?hike_length }. \
			OPTIONAL { ?blank_path_node			sf_ont:Google_encoded_path		?hike_google_encoded_path }. \
		} \
		GRAPH <http://data.sognefjord.vestforsk.no/resource/hike_document> { \
			<"+ hike_uri_name +">	dct:title					?hike_title . \
			<"+ hike_uri_name +">	sf_ont:ingress				?hike_ingress . \
		} \
	} ";
	
	var escaped_query = escape(query);
	var escaped_query_url = "http://178.79.179.144:8890/sparql?default-graph-uri=&query=" + escaped_query + "&format=json";
	
	sognefjord_get_one_selected_hike_query_deferred.resolve(escaped_query_url);
	return sognefjord_get_one_selected_hike_query_deferred;
} //END sognefjord_hike_path_query()


/**
	Hentar ut info om ting av typen hike, inkluderar kriteria som begrensar søka også.
	Formålet med denne er eigentlig berre å få ei liste med uri, uri namn og namn til tingen.
	(Køyrer ein query som hentar all info om kvar ting basert på denne lista seinare.)
	Hugs at google encoded path til hike IKKJE vert henta ut her,
	men i ein eigen funksjon pga. svaret overgår Virtuoso sine grenser på mengde tekst.
*/
function sognefjord_hike_query() {

	//dersom input så får desse verdiar
	var select_duration = "" ;
	var duration_query = "" ;
	
	var select_length = "" ;
	var length_query = "" ;
	
	//dersom input har verdi så skal SPARQL queryen utvidast
	if(duration_min_input.length > 0 || duration_max_input.length > 0) 
	{	
	
		select_duration = "?thing_duration";
		
		duration_query = "	?thing_uri_name		owl-time:duration		?blank_node . \
							?blank_node			owl-time:minute			?thing_duration . \
							";
							
		if(duration_min_input.length > 0) {
			duration_query = duration_query +	"FILTER (xs:integer(?thing_duration) >=		"+duration_min_input+") \
								";
		}
		
		if(duration_max_input.length > 0) {
			
			duration_query = duration_query +	"FILTER (xs:integer(?thing_duration) <=		"+duration_max_input+") \
								";
		}
	}
	
	//dersom input har verdi så skal SPARQL queryen utvidast
	if(length_min_input.length > 0 || length_max_input.length > 0) 
	{	
	
		select_length = "?thing_length";
		
		length_query = "	?thing_uri_name			sf_ont:Length		?blank_length_node . \
							?blank_length_node		sf_ont:Kilometer	?thing_length . \
							";
							
		if(length_min_input.length > 0) {
			length_query = length_query +	"FILTER (xs:integer(?thing_length) >=		"+length_min_input+") \
								";
		}
		
		if(length_max_input.length > 0) {
			
			length_query = length_query +	"FILTER (xs:integer(?thing_length) <=		"+length_max_input+") \
								";
		}
	}
	
	var query = "PREFIX sf_ml_ont: <http://data.sognefjord.vestforsk.no/resource/ml-ontology#> \
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
	PREFIX sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> \
	PREFIX owl: <http://www.w3.org/2002/07/owl#> \
	PREFIX owl-time: <http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#>    \
	PREFIX xs: <http://www.w3.org/2001/XMLSchema#> \
	\
	SELECT ?thing_uri ?thing_uri_name "+select_duration+" "+select_length+" \
	WHERE { \
		GRAPH <http://data.sognefjord.vestforsk.no/resource/semantic_touring> { \
			?thing_uri			rdf:type			owl:Individual . \
			?thing_uri_name		sf_ml_ont:nameOf	?thing_uri . \
		} \
		GRAPH <http://data.sognefjord.vestforsk.no/resource/hike> { \
			?thing_uri_name		rdf:type				sf_ont:O36_917 . \
			" + duration_query + " " + length_query + " \
		} \
	} ";
	//alert(query);
	
	var escaped_query = escape(query);
	escaped_query = "http://178.79.179.144:8890/sparql?default-graph-uri=&query=" + escaped_query + "&format=json";
	//alert(escaped_query);
	return escaped_query;
}



function put_hikes_on_the_map(endpoint_reply) {
	var put_hikes_on_the_map_deferred = new dojo.Deferred();
	
	var result_count = endpoint_reply.results.bindings.length;
	var array_length_0_index = endpoint_reply.results.bindings.length - 1;
	var deferred_list_array = [];
	
	for ( i=0; i<=array_length_0_index; i++ ){
		console.log(i);

		var hike_uri = endpoint_reply.results.bindings[i].thing_uri.value;
		var hike_uri_name = endpoint_reply.results.bindings[i].thing_uri_name.value;
		
		console.debug("#4_1. START");
		dojo.when(
			sognefjord_get_one_selected_hike_query(hike_uri_name),
			function(escaped_query_url) {
				console.debug(escaped_query_url);
				console.debug("#4_1. END");
				
				var url_plus_hike_uri = [];
				url_plus_hike_uri.push(escaped_query_url);
				url_plus_hike_uri.push(hike_uri);
				url_plus_hike_uri.push(hike_uri_name);
				
				deferred_list_array.push(
					read_cross_domain_data(
						url_plus_hike_uri,
						"for_each_hike_do_this"
				));
			}
		); //END dojo.when() #4_1.
	} //END for()
	
	var deferred_list = new dojo.DeferredList(deferred_list_array);
	
	console.log("#4_2. START");
	deferred_list.then(function(result){
		// OBS! "result" is an array of results
		map.fitBounds(zoom_map_on_the_result);
		var content_top = document.getElementById('content-top');
		content_top.innerHTML = "<h1>Hikes ("+ result_count +")</h1>";
		console.log("#4_2. END");
		put_hikes_on_the_map_deferred.resolve(result);
	});
	
	return put_hikes_on_the_map_deferred;
} //END put_hikes_on_the_map()


function put_this_hike_on_the_map(
	endpoint_reply,
	hike_uri,
	hike_uri_name
){
	var put_this_hike_on_the_map_deferred = new dojo.Deferred();
	
	//	hike_uri
	//	hike_uri_name
	var hike_duration				= endpoint_reply.results.bindings[0].hike_duration.value;
	var	google_encoded_polyline		= endpoint_reply.results.bindings[0].hike_google_encoded_path.value;
	var	hike_length					= endpoint_reply.results.bindings[0].hike_length.value;
	var	hike_difficulty				= endpoint_reply.results.bindings[0].hike_difficulty.value;
	var	hike_same_as				= endpoint_reply.results.bindings[0].hike_same_as.value;
	var	hike_type					= endpoint_reply.results.bindings[0].hike_type.value;
	var	hike_title					= endpoint_reply.results.bindings[0].hike_title.value;
	var	hike_ingress				= endpoint_reply.results.bindings[0].hike_ingress.value;
	
	//
	// display hike on the map
	//
	
	var decoded_polyline = google.maps.geometry.encoding.decodePath(google_encoded_polyline);
	var polyline_start = decoded_polyline[0];
	
	//zoom_map_on_the_result
	for ( l in decoded_polyline ) {
		zoom_map_on_the_result.extend(decoded_polyline[l]);
	}
	
	var display_hike_ingress = ""; if (hike_ingress.length > 0) { display_hike_ingress = "<p>" + hike_ingress + "</p>"; }
	var display_hike_duration = ""; if (hike_duration.length > 0) { display_hike_duration = "<b>Duration:</b> " + hike_duration + " minutes<br>"; }
	var display_hike_length = ""; if (hike_length.length > 0) { display_hike_length = "<b>Length:</b> " + hike_length + " kilometer<br>"; }
	var display_hike_difficulty = ""; if (hike_difficulty.length > 0) { display_hike_difficulty = "<b>Difficulty:</b> " + hike_difficulty + "<br>"; }
	
	var content = "<h1>"+ hike_title +"</h1>" + 
		display_hike_ingress + 
		"<p>" + 
		display_hike_duration + 
		display_hike_length + 
		display_hike_difficulty + 
		"</p>" +
		"<p>" + 
		"<a href=\"http://sognefjord.vestforsk.no/tour/hike.php?uri="+ escape(hike_uri_name) +"\" target=\"_blank\">View hike page</a>";
		"</p>";
	
	var polyline = new google.maps.Polyline({
		path: decoded_polyline,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 2,
		map: map,
		hike_uri: hike_uri,
		hike_uri_name: hike_uri_name,
		polyline_start: polyline_start,
		title: hike_title,
		hike_ingress: hike_ingress,
		content: content,
		polyline_path: decoded_polyline
	});
	
	google.maps.event.addListener(polyline, 'click', function(event){ 
		//alert(polyline.hike_uri);
		
		closeInfos();	// close the previous info-window
		
		// the marker's content gets attached to the info-window:
		var infowindow = new google.maps.InfoWindow({
			content: content
		});
		
		infowindow.position = mouselocation;
		infowindow.open(map);		// trigger the infobox's open function
		infoWindowArray[0]=infowindow;	// keep the handle, in order to close it on next click event
		
	});
	
	markers.push(polyline);
	
	//
	// display hike on the list
	//
	
	var content_item = document.createElement("div");
	content_item.innerHTML = "<a href=\"javascript:select_hike(\'"+ hike_uri +"\');\">"+ hike_title +"</a>";
	//"<a href=\"javascript:testing("+ hike_uri +")\">"+ hike_title +"</a>";
	//"<a href=\""+ hike_uri +"\">"+ hike_title +"</a>"; //todo: gjer noko med lenka
	
	var content_list = document.getElementById('content');
	content_list.appendChild(content_item);
	
	put_this_hike_on_the_map_deferred.resolve(polyline);
	return put_this_hike_on_the_map_deferred;
} //END put_this_hike_on_the_map()

function closeInfos(){
	if(infoWindowArray.length > 0){
 
		// detach the info-window from the marker
		infoWindowArray[0].set("marker",null);
	 
		// and close it
		infoWindowArray[0].close();
	 
		// blank the array
		infoWindowArray.length = 0;
	}
} //END closeInfos()


/**
 * Removes all markers specified in the array from the map
 *
 * @param {google.maps.Marker[]} Array of markers
 */  
function delete_markers(mArray) {
	if (mArray) {
		for (i in mArray) {
			mArray[i].setMap(null);
		}
		mArray.length = 0; //clear array
	}
}


function reset_content_list() {
	var content_list = document.getElementById('content');	//get list
	content_list.innerHTML = "";							//empty list
	result_count = 0;										//reset result counter
	var content_top = document.createElement("div");		//prepare new list
	content_top.id = "content-top";
	content_top.innerHTML = "<h1>Hikes ("+ result_count +")</h1><p>Use the form to the right to find hikes that match your criteria.</p>";
	content_list.appendChild(content_top);					//reset list
	return true;
}


function reset_map_position() {
	var latlng = new google.maps.LatLng(65.586185,12.875977);
	map.setCenter(latlng);
	map.setZoom(4);
}

function select_hike(hike_uri) {
	//alert(hike_uri);
	
	dojo.some(markers, function(marker, index){
		//console.debug(marker);
		
		if (marker['hike_uri'] == hike_uri){
				
			closeInfos();	// close the previous info-window
			
			// Fokuser kartet på utvalgt tur-sti (focus and zoom).
			var bounds = new google.maps.LatLngBounds();
			for ( l in marker['polyline_path'] ) {
				bounds.extend(marker.polyline_path[l]);
			}
			map.fitBounds(bounds);
			
			// the marker's content gets attached to the info-window
			var infowindow = new google.maps.InfoWindow({
				content: marker['content']
			});
			
			infowindow.position = marker['polyline_start'];
			infowindow.open(map);			// trigger the infobox's open function
			infoWindowArray[0]=infowindow;	// keep the handle, in order to close it on next click event
			
			scroll(0,0); //scroll page to top!
				
			return false; //same som break i for each. OBS! dersom tingen har fleire markers, vert berre den første den finn valgt...
				
		} //END IF
		
	});
}
function create_sparql_query_url_1() {
	var deferred = new dojo.Deferred();
	// Hent liste over alle turar som har google encoded path.
	var query = "PREFIX sf_ml_ont: <http://data.sognefjord.vestforsk.no/resource/ml-ontology#> \
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
	PREFIX owl: <http://www.w3.org/2002/07/owl#> \
	PREFIX sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> \
	\
	SELECT \
		?thing_uri \
		?thing_uri_name \
	WHERE { \
		GRAPH <http://data.sognefjord.vestforsk.no/resource/semantic_touring> { \
			?thing_uri			rdf:type			owl:Individual . \
			?thing_uri_name		sf_ml_ont:nameOf	?thing_uri . \
		} \
		GRAPH <http://data.sognefjord.vestforsk.no/resource/hike> { \
			?thing_uri_name		rdf:type			sf_ont:O36_917 . \
			?thing_uri_name		sf_ont:Path			?blank_path_node . \
		} \
	}";
	var escaped_query = escape(query);
	escaped_query = "http://178.79.179.144:8890/sparql?default-graph-uri=&query=" + escaped_query + "&format=json";
	deferred.resolve(escaped_query);
	return deferred;	
} //END create_sparql_query_url_1()



function read_cross_domain_data(
	type,
	url
){
	var read_cross_domain_data_deferred = new dojo.Deferred();
	
	if(type == "query_sparql_endpoint") {
		dojo.io.script.get({
			callbackParamName: "callback",
			url: url,
			handleAs: "json", // Convert response to a JavaScript object
			load: function(response, ioArgs) {
				read_cross_domain_data_deferred.resolve(response);
			}
		});
	}
	
	return read_cross_domain_data_deferred;
} //END read_cross_domain_data()


function for_each_thing_in_reply_2(
	reply_2,
	what_to_do
){
	var for_each_thing_in_reply_2_deferred = new dojo.Deferred();
	
	var array_index = reply_2.results.bindings.length - 1;
	var dl_array = [];
	
	if (what_to_do == "download_xml_data") {
		for (	i = 0; 
				i <= array_index;
				i++
		){
			dl_array.push(handle_thing(reply_2.results.bindings[i]));
			
		//	console.debug(reply_2.results.bindings[i]);
			console.debug(reply_2.results.bindings[i].thing_uri.value);
			
			// IF sistemann i loopen,
			// opprett "deferred list",
			// som igjen vert kjøyrt etter loopen er ferdig.
			if ( i == array_index ) {
				//console.debug("sistemann");
				var dl = new dojo.DeferredList(dl_array);
			}
		} //END for()
	} //END if()
	
	if (what_to_do == "generate_rdf_triples") {
		for (	i = 0; 
				i <= array_index;
				i++
		){
			dl_array.push(generate_rdf_triples(reply_2.results.bindings[i]));
			
		//	console.debug(reply_2.results.bindings[i]);
		//	console.debug(reply_2.results.bindings[i].thing_uri.value);
			
			// IF sistemann i loopen,
			// opprett "deferred list",
			// som igjen vert kjøyrt etter loopen er ferdig.
			if ( i == array_index ) {
				//console.debug("sistemann");
				var dl = new dojo.DeferredList(dl_array);
			}
		} //END for()
	} //END if()
	
	dl.then(function(result){ // "result" is an array of results
		// etter at deferred list er utført, gjer dette:
		
		for_each_thing_in_reply_2_deferred.resolve("All done");
	});

	return for_each_thing_in_reply_2_deferred;
} //END for_each_thing_in_reply_2()



function create_sparql_query_url_2(thing_uri_name) {
	var create_sparql_query_url_2_deferred = new dojo.Deferred();
	// Hent utvalgt ting sin google encoded path (tur rute)
	var query = "PREFIX sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> \
	\
	SELECT ?hike_path \
	WHERE { \
		GRAPH <http://data.sognefjord.vestforsk.no/resource/hike> { \
			<"+ thing_uri_name +">	sf_ont:Path						?blank_path_node . \
			?blank_path_node		sf_ont:Google_encoded_path		?hike_path . \
		} \
	}";
	
	var escaped_query = escape(query);
	
	escaped_query = "http://178.79.179.144:8890/sparql?default-graph-uri=&query=" + escaped_query + "&format=json";
	//alert(escaped_query);
	create_sparql_query_url_2_deferred.resolve(escaped_query);
	return create_sparql_query_url_2_deferred;
} //END create_sparql_query_url_2()



function create_sparql_query_url_3(thing_uri_name) {
	var create_sparql_query_url_3_deferred = new dojo.Deferred();
	
	// Mål: Generere ein ny graf med meir data om ei rute.
	// 		Dette fordi endring av gamal graf vil påvirke andre apps.
	//		Hent derfor ut den data du vil ha med vidare frå utvalgt ting.
	
	var query = "\
	PREFIX sf_ont:		<http://data.sognefjord.vestforsk.no/resource/ontology#> \
	PREFIX owl-time:	<http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#> \
	PREFIX owl:			<http://www.w3.org/2002/07/owl#> \
	\
	SELECT \
		?hike_path \
		?hike_duration \
		?hike_length \
		?hike_same_as \
	WHERE { \
		GRAPH <http://data.sognefjord.vestforsk.no/resource/hike> { \
			<"+ thing_uri_name +">	sf_ont:Path						?blank_path_node ; \
									owl-time:duration				?blank_duration ; \
									sf_ont:Length					?blank_length ; \
									owl:sameAs						?hike_same_as . \
									\
			?blank_path_node		sf_ont:Google_encoded_path		?hike_path . \
			?blank_duration			owl-time:minute					?hike_duration . \
			?blank_length			sf_ont:Kilometer				?hike_length . \
		} \
	}";
	
	var escaped_query = escape(query);
	
	escaped_query = "http://178.79.179.144:8890/sparql?default-graph-uri=&query=" + escaped_query + "&format=json";
	//alert(escaped_query);
	create_sparql_query_url_3_deferred.resolve(escaped_query);
	return create_sparql_query_url_3_deferred;
} //END create_sparql_query_url_3()



function handle_thing(thing_object){
	var handle_thing_deferred = new dojo.Deferred();
	
	var thing_uri		= thing_object.thing_uri.value;
	var thing_uri_name	= thing_object.thing_uri_name.value;
	var thing_name		= get_thing_name(thing_uri_name);
	
	dojo.when(
		create_sparql_query_url_2(thing_uri_name),
		function(sparql_query_url_2) {
		
	
	// Hentar meir info om ting frå sparql endpoint.
	dojo.when(
		read_cross_domain_data(
			"query_sparql_endpoint",
			sparql_query_url_2
		),
		function(sparql_endpoint_reply) {
	
		//	console.debug(thing_uri);
		//	console.debug(sparql_endpoint_reply);
			
			if ( sparql_endpoint_reply.results.bindings.length == 1 ) {
				if ( sparql_endpoint_reply.results.bindings[0].hike_path.value.length > 0 ) {
					
					//
					// Denne tingen har google encoded path!
					//
					var encoded_polyline = sparql_endpoint_reply.results.bindings[0].hike_path.value;
				//	console.debug(encoded_polyline);
					console.debug(thing_uri + " - Path found.");

					

	dojo.when(
		decode_google_path(encoded_polyline),
		function(path_in_an_array) {
		
			//console.debug(path_in_an_array);
			// Example of an Object in Array:
			// lat: 60.38527
			// lon: 5.36287
			
			for ( p in path_in_an_array) {
				console.debug(thing_uri + " lat:" + path_in_an_array[p].lat + " lng:" + path_in_an_array[p].lon);
				
	dojo.when(
		save_hike_path_data(
			path_in_an_array[p].lat,
			path_in_an_array[p].lon
		),
		function(saved_if_true) {
		
			if (saved_if_true == "TRUE") {
				//console.debug(thing_uri + " lat:" + path_in_an_array[p].lat + " lng:" + path_in_an_array[p].lon + " File saved!");
				console.debug(thing_uri + " Location file saved!");
			}
			else {
				//console.debug(thing_uri + " lat:" + path_in_an_array[p].lat + " lng:" + path_in_an_array[p].lon + " File NOT saved!");
				console.debug(thing_uri + " Location file NOT saved!");
			}

			
		}
	); //END dojo.when()
	
			} //END for()
			
			handle_thing_deferred.resolve(sparql_endpoint_reply);
	
		}
	); //END dojo.when()
					
				}
				else {
					// Her er ein feil: Denne tingen er tagga med "Google_encoded_path" og har eit objekt, MEN
					// verdien av objektet er ingenting som dette: "".
					console.debug(thing_uri + " - Path NOT found.");
					handle_thing_deferred.resolve(sparql_endpoint_reply);
				}
			}
			else if ( sparql_endpoint_reply.results.bindings.length == 0 ) {
				// Denne tingen har ikkje google encoded path
				console.debug(thing_uri + " - Path NOT found.");
				handle_thing_deferred.resolve(sparql_endpoint_reply);
			}
			else {
				// Array har fleire enn eit objekt i seg. Noko er altså feil.
				console.debug("Noko er feil her.");
				handle_thing_deferred.resolve(sparql_endpoint_reply);
			}
			
		}
	); //END dojo.when()
		}
	); //END dojo.when()
		
	
	return handle_thing_deferred;
} //END handle_thing()



function generate_rdf_triples(thing_object){
	var generate_rdf_triples_deferred = new dojo.Deferred();
	
	var thing_uri		= thing_object.thing_uri.value;
	var thing_uri_name	= thing_object.thing_uri_name.value;
	var thing_name		= get_thing_name(thing_uri_name);
	
	dojo.when(
		create_sparql_query_url_3(thing_uri_name),
		function(sparql_query_url_3) {
		
	
	// Hentar meir info om ting frå sparql endpoint.
	dojo.when(
		read_cross_domain_data(
			"query_sparql_endpoint",
			sparql_query_url_3
		),
		function(sparql_endpoint_reply) {
	
		//	console.debug(thing_uri);
		//	console.debug(sparql_endpoint_reply);
			
			// Return example:
			
			// hike_duration: Object
			// value: "30"

			// hike_length: Object
			// value: "1.5"

			// hike_path: Object
			// value: "c{aoJek`_@\z@TtA@l@Qn@MHe@CiB}AeAeDY}AQiBAsBKg@qD{BOa@E[Bq@TYb@B|@ZzAURMDWEg@a@k@CQFg@bAe@bAiAJUFWK_BDeBp@{BpBwFZwAzAgCX}@H{@JmGHkAPkAn@iCDa@AUQs@Ck@bBaJXgD"

			// hike_same_as: Object
			// value: "http://tur.bt.no/tur/109"
			

			if ( sparql_endpoint_reply.results.bindings.length == 1 ) {
			
				//
				// Sjekkar at me har dei verdiane me treng
				//
				if (	sparql_endpoint_reply.results.bindings[0].hike_path.value.length > 0 &&
						sparql_endpoint_reply.results.bindings[0].hike_duration.value.length > 0 &&
						sparql_endpoint_reply.results.bindings[0].hike_length.value.length > 0 &&
						sparql_endpoint_reply.results.bindings[0].hike_same_as.value.length > 0
				){
					

					var encoded_polyline = sparql_endpoint_reply.results.bindings[0].hike_path.value;
				//	console.debug(encoded_polyline);
				//	console.debug(thing_uri + " - Path found.");

					console.debug("nja"); //TEMP har ein error her. mange ting finn ikkje all lokasjonsdata i fila generate_RDF_triples.php
					
					//
					// Generer RDF tripplar for utvalgt ting!
					//
					dojo.xhrPost({ //HTTP POST REQUEST
						url: "generate_RDF_triples.php",
						content: {
							google_encoded_polyline:	sparql_endpoint_reply.results.bindings[0].hike_path.value,
							thing_name:					thing_name,
							hike_duration:				sparql_endpoint_reply.results.bindings[0].hike_duration.value,
							hike_length:				sparql_endpoint_reply.results.bindings[0].hike_length.value,
							hike_same_as:				sparql_endpoint_reply.results.bindings[0].hike_same_as.value
						},
						handleAs: "text",
						handle: function(response, ioArgs) { // The callback that fires regardless of request success or failure.
							return response;
						}
					}).then(function(saved_if_true){
						console.debug(saved_if_true);
						generate_rdf_triples_deferred.resolve(saved_if_true);
					});
					
				}
				else {
					// Her er ein feil: Denne tingen er tagga med "Google_encoded_path" og har eit objekt, MEN
					// verdien av objektet er ingenting som dette: "".
					console.debug(thing_uri + " - Path NOT found.");
					generate_rdf_triples_deferred.resolve(sparql_endpoint_reply);
				}
			}
			else if ( sparql_endpoint_reply.results.bindings.length == 0 ) {
				// Denne tingen har ikkje google encoded path
				console.debug(thing_uri + " - Path NOT found.");
				generate_rdf_triples_deferred.resolve(sparql_endpoint_reply);
			}
			else {
				// Array har fleire enn eit objekt i seg. Noko er altså feil.
				console.debug("Noko er feil her.");
				generate_rdf_triples_deferred.resolve(sparql_endpoint_reply);
			}	
		
		}
	); //END dojo.when()
		}
	); //END dojo.when()
	
							/*
							for ( p in path_in_an_array) {
								console.debug(thing_uri + " lat:" + path_in_an_array[p].lat + " lng:" + path_in_an_array[p].lon);
								
								dojo.when(
									save_hike_path_data(
										path_in_an_array[p].lat,
										path_in_an_array[p].lon
									),
									function(saved_if_true) {
									
										if (saved_if_true == "TRUE") {
											//console.debug(thing_uri + " lat:" + path_in_an_array[p].lat + " lng:" + path_in_an_array[p].lon + " File saved!");
											console.debug(thing_uri + " Location file saved!");
										}
										else {
											//console.debug(thing_uri + " lat:" + path_in_an_array[p].lat + " lng:" + path_in_an_array[p].lon + " File NOT saved!");
											console.debug(thing_uri + " Location file NOT saved!");
										}

										
									}
								); //END dojo.when()
					
							} //END for()
							*/	
	
	return generate_rdf_triples_deferred;
} //END generate_rdf_triples()




// This function is from Google's polyline utility.
function decode_google_path(encoded) {
	var decode_google_path_deferred = new dojo.Deferred();

    var len = encoded.length;
    var index = 0;
    var array = [];
    var lat = 0;
    var lng = 0;
    
    while (index < len) {
		var b;
		var shift = 0;
		var result = 0;
		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);
		var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
		lat += dlat;
		
		shift = 0;
		result = 0;
		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);
		var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
		lng += dlng;

		array.push({"lat": round(lat * 1e-5), "lon": round(lng * 1e-5)});
    }
    
    decode_google_path_deferred.resolve(array);
	return decode_google_path_deferred;
}


// Clean up floating point math errors
function round(a) {
    return parseInt(a*1E+5)/1E+5;
}


function get_thing_name(thing_uri_name){
	var split_array = thing_uri_name.split("#");	//eksempel: http://data.sognefjord.vestforsk.no/resource/ontology#hike316
	return split_array[1];							//eksempel: hike316
} //END get_thing_name()


function save_hike_path_data(
	lat,
	lng
){
	var save_hike_path_data_deferred = new dojo.Deferred();
	var url =	"http://localhost/statenskartvesen/point_by_point/save_statkart_info_from_this_geo_point.php?lat=" +
				lat + "&lng=" + lng;
	
	dojo.xhrGet({ //HTTP POST REQUEST
		url: url,
		handleAs: "text",
		handle: function(response, ioArgs) { // The callback that fires regardless of request success or failure.
			return response;
		}
	}).then(function(saved_if_true){
		save_hike_path_data_deferred.resolve(saved_if_true);
	});
	
	return save_hike_path_data_deferred;
} //END save_route_graph()
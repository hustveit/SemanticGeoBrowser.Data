


function create_sparql_query_url_1() {
	var deferred = new dojo.Deferred();
	// Hent liste over alle turar.
	var query = "PREFIX sf_ml_ont: <http://data.sognefjord.vestforsk.no/resource/ml-ontology#> \
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
	PREFIX sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> \
	PREFIX owl: <http://www.w3.org/2002/07/owl#> \
	PREFIX owl-time: <http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#>    \
	PREFIX xs: <http://www.w3.org/2001/XMLSchema#> \
	\
	SELECT ?thing_uri ?thing_uri_name \
	WHERE { \
		GRAPH <http://data.sognefjord.vestforsk.no/resource/semantic_touring> { \
			?thing_uri			rdf:type			owl:Individual . \
			?thing_uri_name		sf_ml_ont:nameOf	?thing_uri . \
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



function for_each_thing_in_reply_2(reply_2){
	var for_each_thing_in_reply_2_deferred = new dojo.Deferred();
	
	var array_index = reply_2.results.bindings.length - 1;
	var dl_array = [];
	
	for (	i = 0; 
			i <= array_index;
			i++
	){
		dl_array.push(handle_thing(reply_2.results.bindings[i]));
		
		console.debug(reply_2.results.bindings[i]);
		
		// IF sistemann i loopen,
		// opprett "deferred list",
		// som igjen vert kjøyrt etter loopen er ferdig.
		if ( i == array_index ) {
		
			console.debug("sistemann");
			
			var dl = new dojo.DeferredList(dl_array);
		}
	} //END for()
	
	dl.then(function(result){ // "result" is an array of results
		// etter at deferred list er utført, gjer dette:
		
		for_each_thing_in_reply_2_deferred.resolve("hei");
	});

	
/*	
  // create a deferred list to aggregate the state
  var dl = new dojo.DeferredList([d1, d2, d3]);

  // a DeferredList has much the same API as a Deferred
  dl.then(function(res){
    // "res" is an array of results
	console.log("hei");
    console.log(res);
	for_each_thing_in_reply_2_deferred.resolve(res);
  });
*/
	
	
	/*
	var dl_array = [];
	
	for ( t in reply_2.results.bindings ){
		var thing_object = reply_2.results.bindings[t];
		
		dl_array.push(function(){
			console.debug("buu");
			return "buuu";
		});
		
		console.debug(thing_object);
	} //END for()
	
	var dl = new dojo.DeferredList([dl_array]); // deferred list array
	
	dl.then(function(result){
		// "result" is an array of results
		// etter at deferred list er utført, gjer dette:
		
		for_each_thing_in_reply_2_deferred.resolve("hei");
	});
	*/
	
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


function handle_thing(thing_object){
	var handle_thing_deferred = new dojo.Deferred();
	
	var thing_uri		= thing_object.thing_uri.value;
	var thing_uri_name	= thing_object.thing_uri_name.value;
	var thing_name		= get_thing_name(thing_uri_name);
	
	console.debug(thing_uri);
	
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
	
	
			console.debug(thing_uri);
			console.debug(sparql_endpoint_reply);
			
			if ( sparql_endpoint_reply.results.bindings.length == 1 ) {
				if ( sparql_endpoint_reply.results.bindings[0].hike_path.value.length > 0 ) {
					
					//
					// Denne tingen har google encoded path!
					//
					var encoded_polyline = sparql_endpoint_reply.results.bindings[0].hike_path.value;
					console.debug(encoded_polyline);
					
					/*
					//then then then...
					decode_google_path(encoded_polyline).then(function(path_in_an_array){
					create_gpx_file_content(path_in_an_array).then(function(gpx_file_content){
					save_gpx_file_content(gpx_file_content).then(function(true_or_false){

						//TODO: save_gpx_file_content

			//true if gpx file is saved, false if not.
			if ( true_or_false == true ) {
				console.debug("gpx file is saved");
			}
			else {
				console.debug("gpx file is not saved");
			}
		
					}); //END save_gpx_file_content()
					}); //END create_gpx_file_content()
					}); //END decode_google_path()
					*/
					

	dojo.when(
		decode_google_path(encoded_polyline),
		function(path_in_an_array) {
	dojo.when(
		create_gpx_file_content(path_in_an_array),
		function(gpx_file_content) {
	dojo.when(
		save_gpx_file_content(
			gpx_file_content,
			thing_name
		),
		function(true_or_false) {
			//true if gpx file is saved, false if not.
			if ( true_or_false == true ) {
				//console.debug("gpx file is saved");
				
	// Rask løysing for å få url til .gpx filene.
	// Har lasta opp .gpx filene på ein tjenar. Eksempel url: http://sognefjord.vestforsk.no/gpx_output/hike101.gpx
	var gpx_file_url = "http://sognefjord.vestforsk.no/gpx_output/" + thing_name + ".gpx";

	dojo.when(
		generate_route_graph(gpx_file_url),
		function(graph_url) {
			console.debug(thing_name);
			console.debug(graph_url);
	
	dojo.when(
		save_route_graph(
			thing_name,
			graph_url
		),
		function(saved_if_true) {
			if (saved_if_true == true) {
				console.debug("graph file is saved");
			}
			handle_thing_deferred.resolve(sparql_endpoint_reply);
			
		}
	); //END dojo.when()
		}
	); //END dojo.when()

			}
			else {
				console.debug("gpx file is not saved");
				handle_thing_deferred.resolve(sparql_endpoint_reply);
			}
		}
	); //END dojo.when()
		}
	); //END dojo.when()
		}
	); //END dojo.when()
					
				}
				else {
					// Her er ein feil: Denne tingen er tagga med "Google_encoded_path" og har eit objekt, MEN
					// verdien av objektet er ingenting som dette: "".
					console.debug("Denne tingen har ikkje google encoded path.");
					handle_thing_deferred.resolve(sparql_endpoint_reply);
				}
			}
			else if ( sparql_endpoint_reply.results.bindings.length == 0 ) {
				// Denne tingen har ikkje google encoded path
				console.debug("Denne tingen har ikkje google encoded path.");
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









/*
function read_cross_domain_data(
	//url,
	type
){
	var deferred = new dojo.Deferred();

	if(type == "ask_statkart_api_to_find_this") {
	
		alert("hei");
		
		
		// The "xhrGet" method executing an HTTP GET
		// Eksempel: http://dojotoolkit.org/documentation/tutorials/1.6/ajax/
		dojo.xhrGet({
		
			// The URL to request
			url: "http://localhost/statenskartvesen/php_proxy.php?yws_path=skwms1%2Fwps.elevat",
			handleAs: "xml",
			handle: function(response, ioArgs) { // The callback that fires regardless of request success or failure.
				console.debug(response); // DOM Document
				console.debug(ioArgs);
				return response;
			}
		}).then(function(dom_response){
			
			var xml_doc_node = dom_response.documentElement;
			var png_image = xml_doc_node.childNodes[5].childNodes[1].childNodes[5].getAttribute("xlink:href"); // http://www.geonorge.no/ ...... .png bilde
			
			alert("hei2");
			deferred.resolve(dom_response);
			
		});
	} //END if()

	return deferred;
} //END read_cross_domain_data()
*/


function create_gpx_file_content(path_in_an_array){
	var create_gpx_file_content_deferred = new dojo.Deferred();
	
	var array_length = path_in_an_array.length;
	
	if ( array_length > 0 ){
		var array_0_index = array_length - 1;
		
		var gpx_content = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?> \n\
\n\
<gpx xmlns=\"http://www.topografix.com/GPX/1/1\" creator=\"lonvia.de\" version=\"1.1\"\n\
    xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n\
    xsi:schemaLocation=\"http://www.topografix.com/GPX/1/1\n\
                 http://www.topografix.com/GPX/1/1/gpx.xsd\">\n\
\n\
	<metadata>\n\
		<name>Test</name>\n\
		<link href=\"http://test.no\">\n\
			<text>Test</text>\n\
		</link>\n\
	</metadata>\n\
\n\
	<trk>\n\
		<trkseg>\n";
							
		//For kvar lokasjon i ruta
		for (	i = 0; 
			i <= array_0_index; 
			i++
		){
			gpx_content += "			<trkpt lat=\"" +
				path_in_an_array[i].lat + "\" lon=\"" +
				path_in_an_array[i].lon + "\"/>\n";
		} //END for()
		
		gpx_content += "		</trkseg>\n\
	</trk>\n\
</gpx>";
	
	create_gpx_file_content_deferred.resolve(gpx_content);
	}
	else {
		console.debug("FEIL: Ei rute utan lokasjonar er inga rute.");
		create_gpx_file_content_deferred.resolve(false);
	}
	
	return create_gpx_file_content_deferred;
} //END create_gpx_file_content()


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


/* Mal
function (){
	var _deferred = new dojo.Deferred();
	

	
	return _deferred;
} //END ()
*/


// Få PHP skript til å lagre .gpx aktuelt dokument.
function save_gpx_file_content(
	gpx_file_content,
	thing_name
){
	var save_gpx_file_content_deferred = new dojo.Deferred();
	
	dojo.xhrPost({ //HTTP POST REQUEST
		url: "create_gpx_document.php",
		content: {
			gpx_content: gpx_file_content,
			thing_name: thing_name
		},
		handleAs: "text",
		handle: function(response, ioArgs) { // The callback that fires regardless of request success or failure.
			return response;
		}
	}).then(function(true_or_false){ //true if gpx file is saved, false if not.
		save_gpx_file_content_deferred.resolve(true_or_false);
	});
	
	return save_gpx_file_content_deferred;
} //END save_gpx_file_content()


function get_thing_name(thing_uri_name){
	var split_array = thing_uri_name.split("#");	//eksempel: http://data.sognefjord.vestforsk.no/resource/ontology#hike316
	return split_array[1];							//eksempel: hike316
} //END get_thing_name()


function generate_route_graph(gpx_file_url){
	var generate_route_graph_deferred = new dojo.Deferred();
	
	dojo.xhrPost({ //HTTP POST REQUEST
		url: "php_proxy.php",
		content: {
			gpx_file_url: gpx_file_url
		},
		handleAs: "xml",
		handle: function(response, ioArgs) { // The callback that fires regardless of request success or failure.
			return response;
		}
	}).then(function(dom_response){
		console.debug(dom_response);
		var xml_doc_node = dom_response.documentElement;
		var png_image_url = xml_doc_node.childNodes[5].childNodes[1].childNodes[5].getAttribute("xlink:href"); // http://www.geonorge.no/ ...... .png bilde
		
		generate_route_graph_deferred.resolve(png_image_url);
	});
	
	return generate_route_graph_deferred;
} //END generate_route_graph()



function save_route_graph(
	thing_name,
	graph_url
){
	var save_route_graph_deferred = new dojo.Deferred();
	
	dojo.xhrPost({ //HTTP POST REQUEST
		url: "save_graph_image.php",
		content: {
			graph_url: graph_url,
			thing_name: thing_name
		},
		handleAs: "text",
		handle: function(response, ioArgs) { // The callback that fires regardless of request success or failure.
			return response;
		}
	}).then(function(saved_if_true){
		save_route_graph_deferred.resolve(saved_if_true);
	});
	
	return save_route_graph_deferred;
} //END save_route_graph()

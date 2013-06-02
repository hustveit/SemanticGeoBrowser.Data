<?php

function get_data_from_endpoint_1($thing_uri_name)
{
	$format = 'json';
	
	//example uri: http://data.sognefjord.vestforsk.no/resource/ontology#hike101
	
	$query = "
	PREFIX rdf:			<http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
	PREFIX sf_ont:		<http://data.sognefjord.vestforsk.no/resource/ontology#> 
	PREFIX owl:			<http://www.w3.org/2002/07/owl#> 
	PREFIX owl-time:	<http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#>    
	PREFIX dct:			<http://purl.org/dc/terms/>
	PREFIX ucum:		<http://purl.oclc.org/NET/muo/ucum/>
	
	SELECT
		?hike_duration
		?hike_length
		?hike_minimum_elevation
		?hike_maximum_elevation
		?hike_difference_in_elevation
		?hike_height_increase
		?hike_height_decrease
		?hike_start_of_lat
		?hike_start_of_long
		?hike_start_of_altitude
		?hike_end_of_lat
		?hike_end_of_long
		?hike_end_of_altitude
		?hike_path
		?hike_profile
		?hike_url
		?hike_same_as
		?hike_title
		?hike_ingress
		?hike_description
		?hike_image
	WHERE {
		GRAPH <http://data.sognefjord.vestforsk.no/resource/tourism_hike> { 
			<".$thing_uri_name.">					owl-time:duration				?blank_duration_node ;
													sf_ont:Length					?blank_length_node ;
													sf_ont:minimumElevation			?blank_minimum_elevation_node ;
													sf_ont:maximumElevation			?blank_maximum_elevation_node ;
													sf_ont:differenceInElevation	?blank_difference_in_elevation_node ;
													sf_ont:heightIncrease			?blank_height_increase_node ;
													sf_ont:heightDecrease			?blank_height_decrease_node ;
													sf_ont:StartOf					?blank_start_of_node ;
													sf_ont:EndOf					?blank_end_of_node ;
													sf_ont:Path						?blank_path_node ;
			
													sf_ont:Profile					?hike_profile ;
													foaf:isPrimaryTopicOf			?hike_url ;
													owl:sameAs						?hike_same_as .
			
			?blank_duration_node					owl-time:minute					?hike_duration .
			?blank_length_node						sf_ont:Kilometer				?hike_length .
			?blank_minimum_elevation_node			ucum:meter						?hike_minimum_elevation .
			?blank_maximum_elevation_node			ucum:meter						?hike_maximum_elevation .
			?blank_difference_in_elevation_node		ucum:meter						?hike_difference_in_elevation .
			?blank_height_increase_node				ucum:meter						?hike_height_increase .
			?blank_height_decrease_node				ucum:meter						?hike_height_decrease .
			?blank_start_of_node					geo:lat							?hike_start_of_lat ;
													geo:long						?hike_start_of_long ;
													geo:altitude					?hike_start_of_altitude .
			?blank_end_of_node						geo:lat							?hike_end_of_lat ;
													geo:long						?hike_end_of_long ;
													geo:altitude					?hike_end_of_altitude .
			?blank_path_node						sf_ont:GoogleEncodedPath		?hike_path .
		}
		GRAPH <http://data.sognefjord.vestforsk.no/resource/hike_document> { 
			<".$thing_uri_name.">					dct:title						?hike_title ;
													sf_ont:ingress					?hike_ingress ;
													sf_ont:description				?hike_description ;
													sf_ont:image					?hike_image .
		} 
	}
	";
	
   $searchUrl = 'http://178.79.179.144:8890/sparql?'
      .'query='.urlencode($query)
      .'&format='.$format;

   return $searchUrl;
}
	
function request($url){
 
   // is curl installed?
   if (!function_exists('curl_init')){ 
      die('CURL is not installed!');
   }
 
   // get curl handle
   $ch= curl_init();
 
   // set request url
   curl_setopt($ch, 
      CURLOPT_URL, 
      $url);
 
   // return response, don't print/echo
   curl_setopt($ch, 
      CURLOPT_RETURNTRANSFER, 
      true);
 
   /*
   Here you find more options for curl:
   http://www.php.net/curl_setopt
   */		
 
   $response = curl_exec($ch);
 
   curl_close($ch);
 
   return $response;
}


function get_value_from_endpoint_reply($json_input, $value_name){
	$number_of_rows_that_are_relevant = count($json_input['results']['bindings']);
	if($number_of_rows_that_are_relevant > 0){
		if(isset($json_input['results']['bindings'][0][$value_name]['value'])){
			$result = $json_input['results']['bindings'][0][$value_name]['value'];
		}
		
		if ( isset($result) ) { return $result; }
		else { return NULL; }
	}
	else { return NULL; }
}



?>
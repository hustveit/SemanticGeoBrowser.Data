<?php
/**
 * 2012.04.09 - Dette skriptet genererer RDF tripplane som lenker ting til graf bildet.
 * Input - Ei mappe med .png bilder / grafar. Namnet på bildefila må vere det same som namnet på tingen.
 * Eksempel: C:\xampp\htdocs\statenskartvesen\graph_output\hike37.png
 * URL for utføring: http://localhost/statenskartvesen/create_graph_triples.php
 * Output .ttl fila skal settast inn i denne grafen: http://data.sognefjord.vestforsk.no/resource/hike
 */

//
// Instillingar
//

$local_file_path = 'C:/xampp/htdocs/statenskartvesen/graph_output/';
$file_last_name = '.png';
$new_file = "create_graph_triples_output.ttl";

if ($handle = opendir($local_file_path))
{
	echo "Directory handle: $handle\n";
	echo "Files:";
	
	$output_content = array();
	$output_content[] = "@prefix sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> .\n";
	
	//For kvar fil i ei mappe, sett inn line inn i array
	while (false !== ($file_name = readdir($handle)))
	{
		//Tek berre .png filer
		if(false !== endsWith($file_name, $file_last_name))
		{
			//$file_name inneheld til dømes "hike37.png"
			$file_first_name = file_first_name($file_name); //$file_first_name inneheld til dømes "hike37"
		
			//hent tom node frå sparql endpoint
			$thing_uri_name = "http://data.sognefjord.vestforsk.no/resource/ontology#". $file_first_name;
			$requestURL = get_data_from_endpoint_1($thing_uri_name);
			$responseArray = json_decode(request($requestURL),true);
			$blank_path_node = get_blank_path_node($responseArray);
			
			if ( $blank_path_node != null ) {
				
				$output_content[] = "<". $blank_path_node .">	sf_ont:Statkart_profile		<http://sognefjord.vestforsk.no/resource/route-graph/".
					$file_first_name .".png> .\n";
				
				// Skal lage sånne i ei fil:
				// @prefix sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> .
				// <nodeID://b24688> sf_ont:Statkart_graph <http://sognefjord.vestforsk.no/resource/route-graph/hike37.png> .
			}
			else {
				echo "Fant ikkje blank_path_node til denne URI'en: ". $thing_uri_name;
			}
		}
	}
	
	closedir($handle);
	
	//echo print_r($output_content);
	
	//Sett inn i fila
	if(!empty($output_content))
	{
		$insert_lines_in_file = fopen($new_file,"w+");
		
		foreach($output_content as $key => $value)
		{
			fwrite($insert_lines_in_file,$value);
		}
		
		fclose($insert_lines_in_file);
		
		echo "$file_name = OK \n";
	}
	else
	{
		echo "$file_name = Feil \n";
	}

}


function endsWith($haystack, $needle){
    $length = strlen($needle);
    $start  = $length * -1; //negative
    return (substr($haystack, $start) === $needle);
}

function file_first_name($file_name){
	$file_first_name = explode(".png", $file_name);
    return $file_first_name[0];
}

function get_data_from_endpoint_1($thing_uri_name)
{
	$format = 'json';

	$query = "
	PREFIX sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> 
	
	SELECT
		?blank_path_node
	WHERE {
		GRAPH <http://data.sognefjord.vestforsk.no/resource/hike> { 
			<".$thing_uri_name.">	sf_ont:Path					?blank_path_node . 
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


function get_blank_path_node($array){
	$number_of_rows_that_are_relevant = count($array['results']['bindings']);
	if($number_of_rows_that_are_relevant > 0){
		if(isset($array['results']['bindings'][0]['blank_path_node']['value'])){
			$result = $array['results']['bindings'][0]['blank_path_node']['value'];
		}
		
		if (isset($result)) { return $result; }
		else { return NULL; }
	}
	else { return NULL; }
}
?>
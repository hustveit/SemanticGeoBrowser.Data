<?php
//
// Author: Lars Berg Hustveit <lars.berg@hustveit.org>
// Date: 2012.04.19
//
// Formål med skript: Lagre svar frå Statkart.no sin API i ei fil.
// Input: Lokasjon til punktet ein vil ha info om.
// Eksepel request til dette skriptet: http://localhost/statenskartvesen/point_by_point/save_statkart_info_from_this_geo_point.php?lat=60.14363&lng=10.24902

if (	isset($_GET['lat']) AND 
		isset($_GET['lng'])
){
	// Settings
	$output_file = "statkart_geo_point_data\\lat" . $_GET['lat'] . "lng". $_GET['lng'] .".xml";

	// Sjekkar om fil eksisterar frå før
	$file_exists = file_exists($output_file);
	
	if($file_exists){
		// Fila eksisterar! Ikkje gjer noko meir.
		echo "TRUE";
	} //END if()
	else {
		// Fila eksister ikkje! Gjennomfør request til statkart.no
		//example request url: http://openwps.statkart.no/skwms1/wps.elevation?request=Execute&service=WPS&version=1.0.0&identifier=elevation&datainputs=[lat=60.14363;lon=10.24902;epsg=4326]
		$request_url = "http://openwps.statkart.no/skwms1/wps.elevation?request=Execute&service=WPS&version=1.0.0&identifier=elevation&datainputs=[lat=" .
			$_GET['lat'] . ";lon=" .
			$_GET['lng'] . "]";
		
		// Open the Curl session
		$session = curl_init($request_url);
		
		// Don't return HTTP headers. Do return the contents of the call
		curl_setopt($session, CURLOPT_HEADER, false);
		curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
		
		// Make the call
		$xml = curl_exec($session);

		//Action
		$handle_output_file = fopen($output_file, 'wb') or die("Can't open file");
		fwrite($handle_output_file, $xml);
		fclose($handle_output_file);
		
		//echo $xml;
		curl_close($session);
		
		echo "TRUE";
	} //END else
} //END if()
else {
	echo "FALSE";
}
?>
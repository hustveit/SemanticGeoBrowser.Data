<?php
// Modifisert av Lars Berg Hustveit
//
// PHP Proxy example for Yahoo! Web services.
//
// Author: Jason Levitt
// December 7th, 2005
//

if ( isset($_POST['gpx_file_url']) ){
	
	//eksempel: http://openwps.statkart.no/skwms1/wps.elevation?request=Execute&service=WPS&version=1.0.0&identifier=elevationChart&datainputs=[gpx=http://sognefjord.vestforsk.no/test1.gpx]
	$request_url = "http://openwps.statkart.no/skwms1/wps.elevation?request=Execute&service=WPS&version=1.0.0&identifier=elevationChart&datainputs=[gpx=" .
		$_POST['gpx_file_url'] .
		"]";
	
	// Open the Curl session
	$session = curl_init($request_url);

	// Don't return HTTP headers. Do return the contents of the call
	curl_setopt($session, CURLOPT_HEADER, false);
	curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

	// Make the call
	$xml = curl_exec($session);

	// The web service returns XML. Set the Content-Type appropriately
	header("Content-Type: text/xml");

	echo $xml;
	curl_close($session);
} //END if()
/*
	// Allowed hostname (api.local and api.travel are also possible here)
	define ('HOSTNAME', 'http://openwps.statkart.no/');

	// Get the REST call path from the AJAX application
	// Is it a POST or a GET?
	$path = "skwms1/wps.elevation?request=Execute&service=WPS&version=1.0.0&identifier=elevationJSON&datainputs=[gpx=http://myhost/tur.gpx]"; //$_GET['yws_path'];
	$url = HOSTNAME.$path;
	
	// Open the Curl session
	$session = curl_init("http://openwps.statkart.no/skwms1/wps.elevation?request=Execute&service=WPS&version=1.0.0&identifier=elevationChart&datainputs=[gpx=http://sognefjord.vestforsk.no/test1.gpx]");
*/
?>
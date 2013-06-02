<?php //UTF-8
// Lagre .gpx fil
// Input kjem med HTTP POST REQUEST

if (	isset($_POST['graph_url']) AND 
		isset($_POST['thing_name'])
){
	//Settings
	$output_file = "graph_output\\" . $_POST['thing_name'] . ".png";
	
	//Action
	$graph_image = curl_init($_POST['graph_url']);
	$handle_output_file = fopen($output_file, 'wb') or die("Can't open file");
	curl_setopt($graph_image, CURLOPT_FILE, $handle_output_file);
	curl_setopt($graph_image, CURLOPT_HEADER, 0);
	curl_exec($graph_image);
	curl_close($graph_image);
	fclose($handle_output_file);
	
	
	//copy($_POST['graph_url'], $output_file);
	
	//Reply
	echo true; //Gir beskjed til skript at det gjekk bra
}
else {
	echo false; //Gir beskjed til skript at det gjekk dårleg
}
?>
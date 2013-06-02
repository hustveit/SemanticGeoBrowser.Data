<?php //UTF-8
// Lagre .gpx fil
// Input kjem med HTTP POST REQUEST

if (	isset($_POST['gpx_content']) AND 
		isset($_POST['thing_name'])
){
	//Settings
	$output_file = "gpx_output\\" . $_POST['thing_name'] . ".gpx";
	
	//Action
	$handle_output_file = fopen($output_file, 'w') or die("Can't open file");
	fwrite($handle_output_file, $_POST['gpx_content']);
	fclose($handle_output_file); //Avsluttar handtering av outputfila
	
	//Reply
	echo true; //Gir beskjed til skript at det gjekk bra
}
else {
	echo false; //Gir beskjed til skript at det gjekk dårleg
}
?>
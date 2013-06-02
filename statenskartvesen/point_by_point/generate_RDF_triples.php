<?php
// http://localhost/statenskartvesen/point_by_point/

if (	isset($_POST['google_encoded_polyline']) AND 
		isset($_POST['thing_name']) AND
		isset($_POST['hike_duration']) AND
		isset($_POST['hike_length']) AND
		isset($_POST['hike_same_as'])
){
	$google_encoded_polyline =	$_POST['google_encoded_polyline'];
	$thing_name =				$_POST['thing_name'];
	$thing_name_id =			explode("hike", $thing_name);
	$hike_duration =			$_POST['hike_duration'];
	$hike_length =				$_POST['hike_length'];
	$hike_same_as =				$_POST['hike_same_as'];
	
	include_once("decodePolylineToArray.php");
	$path_array = decodePolylineToArray($google_encoded_polyline);
	
	//Example reply
	//echo print_r($path_array);
	//Array ( 
	//	[0] => Array ( 	[0] => 60.44895 
	//					[1] => 5.35578 ) 
	//	[1] => Array ( 	[0] => 60.44894 
	//					[1] => 5.35602 ) 
	//	[2] => Array ( 	[0] => 60.44899 
	//					[1] => 5.35584 ) .........
	
	$path_array_length_1_index = count($path_array);
	
	// Dersom me har minst 2 stk lokasjonar i stien.
	if ( $path_array_length_1_index > 1 ) {
	
		$path_array_length_0_index = $path_array_length_1_index - 1;
		
		$start_location_array = $path_array[0];
		$end_location_array = $path_array[$path_array_length_0_index];
		
		$all_input_data_are_accessible = "true";
		$path_elevation_array = array();
		
		for ($p = 0; $p <= $path_array_length_0_index; $p++) {
		
			// denne returnerer path elevation eller false
			$path_elevation = get_path_elevation(	$path_array[$p][0],	//lat
													$path_array[$p][1]	//lng
			);
			
			if ( $path_elevation == "false" ) {
				// Me lyt ha XML data frå alle lokasjonane.
				// Dersom me ikkje har det, gi opp!
				$all_input_data_are_accessible = "false";
				break;
			} //END if()
			else {
				array_push($path_elevation_array, $path_elevation);				
			} //END else()
			
		} //END for()
		
		$path_elevation_array_count_1 = count($path_elevation_array);		// 1 index count
		$path_elevation_array_count_0 = $path_elevation_array_count_1 - 1;	// 0 index count
		
		if (	$all_input_data_are_accessible == "true" AND	// må ha fullstendig data
				$path_elevation_array_count_1 > 1					// må ha minst 2 lokasjonar
		){
			// Me har XML data til alle lokasjonane i stien.
			
			//echo print_r($path_elevation_array);
			
			// finn største og minste høgdemeter på turen
			$min_elevation = false;
			$max_elevation = false;
			
			$last_elevation = false;
			$total_up = 0;
			$total_down = 0;
			
			foreach( $path_elevation_array as $selected_elevation ) {
				
				//
				// START - Generate $min_elevation and $max_elevation
				//
				
				if (	$min_elevation == false OR
						$max_elevation == false
				){
					$min_elevation = $selected_elevation;
					$max_elevation = $selected_elevation;
				} //END if()
				
				if ( $min_elevation > $selected_elevation ) {
					$min_elevation = $selected_elevation;
				} //END if()
				
				if ( $max_elevation < $selected_elevation ) {
					$max_elevation = $selected_elevation;
				} //END if()
				
				//
				// END
				//
				
				//
				// Generate $total_down and $total_up
				// (Finner stigande eller synkande høgdemeter frå punkt til punkt og summerar saman.)
				//
				
				if ( $last_elevation != false ) {
					
					if ( $last_elevation > $selected_elevation ) {
						//nedoverbakke!
						$meters_between_last_point = $last_elevation - $selected_elevation;
						$total_down = $total_down + $meters_between_last_point;
						
					} //END if()
					elseif ( $last_elevation < $selected_elevation ) {
						//oppoverbakke!
						$meters_between_last_point = $selected_elevation - $last_elevation;
						$total_up = $total_up + $meters_between_last_point;
						
					} //END elseif()
				} //END if()
				
				$last_elevation = $selected_elevation; // utvalgt vert forrige når vi går til neste
				
				//
				// END
				//
				
			} //END foreach()
			
			$difference_in_elevation = $max_elevation - $min_elevation;
			
			/*
			//
			// USE THIS TO DECODE THE RESULT
			//
			echo $thing_name . "<br>";
			
			echo "Path elevation:" .
			" minimumElevation " .			$min_elevation .
			" maximumElevation " .			$max_elevation .
			" heightDecrease " .			$total_down .
			" heightIncrease " .			$total_up .
			" differenceInElevation " .		$difference_in_elevation .
			"<br>";
			
			echo "Start of path:" .
			" Lat " . $start_location_array[0] .
			" Lng " . $start_location_array[1] .
			" Alt " . $path_elevation_array[0] . //elevation/altitude
			"<br>";
			
			echo "End of path:" .
			" Lat " . $end_location_array[0] .
			" Lng " . $end_location_array[1] .
			" Alt " . $path_elevation_array[$path_elevation_array_count_0] . //elevation/altitude
			"<br>";
			*/
			
			//
			// CREATE RESULT FILE (RDF/TURTLE FILE / .ttl)
			//
			$output_content = array();
			$output_content[] = "@prefix sf_ont:		<http://data.sognefjord.vestforsk.no/resource/ontology#> .\n";
			$output_content[] = "@prefix geo:		<http://www.w3.org/2003/01/geo/wgs84_pos#> .\n";
			$output_content[] = "@prefix ucum:		<http://purl.oclc.org/NET/muo/ucum/> .\n";
			$output_content[] = "@prefix owl:		<http://www.w3.org/2002/07/owl#> .\n";
			$output_content[] = "@prefix owl-time:	<http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#> .\n";
			$output_content[] = "@prefix foaf:		<http://xmlns.com/foaf/0.1/> .\n";
			$output_content[] = "\n";
			$output_content[] = "sf_ont:". $thing_name ."\n";
			$output_content[] = "	a								owl:Individual ;\n";
			$output_content[] = "	a								geo:SpatialThing ;\n";
			$output_content[] = "\n";
			$output_content[] = "	owl-time:duration [\n";
			$output_content[] = "		owl-time:minute				\"\"\"". $hike_duration ."\"\"\" ;\n";
			$output_content[] = "	] ;\n";
			$output_content[] = "\n";
			$output_content[] = "	sf_ont:Length [\n";
			$output_content[] = "		sf_ont:Kilometer			\"\"\"". $hike_length ."\"\"\" ;\n";
			$output_content[] = "	] ;\n";
			$output_content[] = "\n";
			$output_content[] = "	sf_ont:minimumElevation [\n";
			$output_content[] = "		ucum:meter					\"\"\"". $min_elevation ."\"\"\" ;\n";
			$output_content[] = "	] ;\n";
			$output_content[] = "\n";
			$output_content[] = "	sf_ont:maximumElevation [\n";
			$output_content[] = "		ucum:meter					\"\"\"". $max_elevation ."\"\"\" ;\n";
			$output_content[] = "	] ;\n";
			$output_content[] = "\n";
			$output_content[] = "	sf_ont:differenceInElevation [\n";
			$output_content[] = "		ucum:meter					\"\"\"". $difference_in_elevation ."\"\"\" ;\n";
			$output_content[] = "	] ;\n";
			$output_content[] = "\n";
			$output_content[] = "	sf_ont:heightIncrease [\n";
			$output_content[] = "		ucum:meter					\"\"\"". $total_up ."\"\"\" ;\n";
			$output_content[] = "	] ;\n";
			$output_content[] = "\n";
			$output_content[] = "	sf_ont:heightDecrease [\n";
			$output_content[] = "		ucum:meter					\"\"\"". $total_down ."\"\"\" ;\n";
			$output_content[] = "	] ;\n";
			$output_content[] = "\n";
			$output_content[] = "	sf_ont:StartOf [\n";
			$output_content[] = "		geo:lat						\"\"\"". $start_location_array[0] ."\"\"\" ;\n";
			$output_content[] = "		geo:long					\"\"\"". $start_location_array[1] ."\"\"\" ;\n";
			$output_content[] = "		geo:altitude				\"\"\"". $path_elevation_array[0] ."\"\"\" ;\n";
			$output_content[] = "	] ;\n";
			$output_content[] = "\n";
			$output_content[] = "	sf_ont:EndOf [\n";
			$output_content[] = "		geo:lat						\"\"\"". $end_location_array[0] ."\"\"\" ;\n";
			$output_content[] = "		geo:long					\"\"\"". $end_location_array[1] ."\"\"\" ;\n";
			$output_content[] = "		geo:altitude				\"\"\"". $path_elevation_array[$path_elevation_array_count_0] ."\"\"\" ;\n";
			$output_content[] = "	] ;\n";
			$output_content[] = "\n";
			$output_content[] = "	sf_ont:Path [\n";
			$output_content[] = "		sf_ont:GoogleEncodedPath	\"\"\"". addslashes($google_encoded_polyline) ."\"\"\" ;\n";
			$output_content[] = "	] ;\n";
			$output_content[] = "\n";
			$output_content[] = "	sf_ont:Profile					<http://sognefjord.vestforsk.no/resource/route-graph/hike". $thing_name_id[1] .".png> ;\n";
			$output_content[] = "\n";
			$output_content[] = "	foaf:isPrimaryTopicOf			<http://sognefjord.vestforsk.no/page/hike/". $thing_name_id[1] ."> ;\n";
			$output_content[] = "\n";
			$output_content[] = "	owl:sameAs						<". $hike_same_as ."> .\n";
			
			$new_file_path = "output_rdf_triples\\" . $thing_name . ".ttl";
			
			//Sett inn i fila
			if(!empty($output_content)) {
				$insert_lines_in_file = fopen($new_file_path,"w+");
				
				foreach($output_content as $key => $value) {
					fwrite($insert_lines_in_file,$value);
				}
				
				fclose($insert_lines_in_file);
				
				echo "true";
			}
			else {
				echo "false4";
			}
			
		} //END if()
		else {
			echo "false3";
		}
	} //END if()
	else {
		echo "false2";
	}
} //END if()
else {
	echo "false1";
}

function get_path_elevation(
	$lat,
	$lng
){
	$input_file = "statkart_geo_point_data\\lat" . $lat . "lng". $lng .".xml";
	$return_this = "false";
	
	// Er denne inputfila å finne?
	if (file_exists($input_file)){
		// In a nutshell: simpleXML virkar ikkje på desse XML filene, dei er ikkje enkle nok!
		// Bruk DOM for å parse XML'en!
		
		$file_content = file_get_contents($input_file);
		$doc = new DOMDocument;
		$doc->loadXML($file_content);

	//	print($doc->saveHTML()); // <-- Einaste måte å å få sjå innholdet på! var_dump($doc) funka ikkje!
		
		$dom = $doc->documentElement;
		
		if ( isset(
			$dom->childNodes->item(5)	//<wps:ProcessOutputs>
				->childNodes->item(5)	//<wps:Output>
				->childNodes->item(1)	//<ows:Identifier>
				->nodeValue				//elevation
		)) {
			if ( "elevation" ==
				$dom->childNodes->item(5)	//<wps:ProcessOutputs>
					->childNodes->item(5)	//<wps:Output>
					->childNodes->item(1)	//<ows:Identifier>
					->nodeValue				//elevation
			) {
				if ( isset(
					$dom->childNodes->item(5)	//<wps:ProcessOutputs>
						->childNodes->item(5)	//<wps:Output>
						->childNodes->item(5)	//<wps:Data>
						->childNodes->item(1)	//<wps:LiteralData>
						->nodeValue				//elevation value
				)) {
					$return_this =
						$dom->childNodes->item(5)	//<wps:ProcessOutputs>
							->childNodes->item(5)	//<wps:Output>
							->childNodes->item(5)	//<wps:Data>
							->childNodes->item(1)	//<wps:LiteralData>
							->nodeValue;			//elevation value
				} //END if()
			} //END if()
		} //END if()
	} //END if()
	
	return $return_this;
	
} //END get_path_elevation()
?>
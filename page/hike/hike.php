<?php
// http://data.sognefjord.vestforsk.no/resource/ontology#hike101
// http%3A%2F%2Fdata.sognefjord.vestforsk.no%2Fresource%2Fontology%23hike101
if(isset($_GET['name'])){

	include_once "script.php";
	
	$hike_id = $_GET['name'];
	$thing_uri_name = "http://data.sognefjord.vestforsk.no/resource/ontology#hike" . $_GET['name'];
	
	// Hent info frå SPARQL endpoint
	$requestURL = get_data_from_endpoint_1($thing_uri_name);
	$responseArray = json_decode(request($requestURL),true);
	//echo print_r($responseArray);
	
	$hike_duration					= get_value_from_endpoint_reply($responseArray, "hike_duration");
	$hike_length					= get_value_from_endpoint_reply($responseArray, "hike_length");
	$hike_minimum_elevation			= get_value_from_endpoint_reply($responseArray, "hike_minimum_elevation");
	$hike_maximum_elevation			= get_value_from_endpoint_reply($responseArray, "hike_maximum_elevation");
	$hike_difference_in_elevation	= get_value_from_endpoint_reply($responseArray, "hike_difference_in_elevation");
	$hike_height_increase			= get_value_from_endpoint_reply($responseArray, "hike_height_increase");
	$hike_height_decrease			= get_value_from_endpoint_reply($responseArray, "hike_height_decrease");
	$hike_start_of_lat				= get_value_from_endpoint_reply($responseArray, "hike_start_of_lat");
	$hike_start_of_long				= get_value_from_endpoint_reply($responseArray, "hike_start_of_long");
	$hike_start_of_altitude			= get_value_from_endpoint_reply($responseArray, "hike_start_of_altitude");
	$hike_end_of_lat				= get_value_from_endpoint_reply($responseArray, "hike_end_of_lat");
	$hike_end_of_long				= get_value_from_endpoint_reply($responseArray, "hike_end_of_long");
	$hike_end_of_altitude			= get_value_from_endpoint_reply($responseArray, "hike_end_of_altitude");
	$hike_path						= addslashes(get_value_from_endpoint_reply($responseArray, "hike_path"));
	$hike_profile					= get_value_from_endpoint_reply($responseArray, "hike_profile");
	$hike_url						= get_value_from_endpoint_reply($responseArray, "hike_url");
	$hike_same_as					= get_value_from_endpoint_reply($responseArray, "hike_same_as");
	$hike_title						= get_value_from_endpoint_reply($responseArray, "hike_title");
	$hike_ingress					= get_value_from_endpoint_reply($responseArray, "hike_ingress");
	$hike_description				= get_value_from_endpoint_reply($responseArray, "hike_description");
	$hike_image						= get_value_from_endpoint_reply($responseArray, "hike_image");
}
else {
	echo "?name=... <--- Sett ein URI.";
}
?>
<!DOCTYPE HTML>
<html version="HTML+RDFa 1.1" lang="en"
	xmlns			= "http://www.w3.org/1999/xhtml"
	xmlns:rdf		= "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns:rdfs		= "http://www.w3.org/2000/01/rdf-schema#"
	xmlns:dct		= "http://purl.org/dc/terms/"
	xmlns:sf_ont	= "http://data.sognefjord.vestforsk.no/resource/ontology#"
	xmlns:geo		= "http://www.w3.org/2003/01/geo/wgs84_pos#"
	xmlns:ucum		= "http://purl.oclc.org/NET/muo/ucum/"
	xmlns:owl		= "http://www.w3.org/2002/07/owl#"
	xmlns:owl-time	= "http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#"
	xmlns:foaf		= "http://xmlns.com/foaf/0.1/">
	<head>
		<meta charset="utf-8">
		
		<title><?php echo $hike_title ?></title>
		
		<link rel="stylesheet" href="layout.css" media="screen">
		<script type="text/javascript" src="script.js"></script>
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?libraries=geometry&amp;sensor=false"></script>
		<script type="text/javascript">
			var encoded_polyline = '<?php echo $hike_path ?>';
		</script>
		<script src="http://ajax.googleapis.com/ajax/libs/dojo/1.6.0/dojo/dojo.xd.js"
				data-dojo-config="isDebug: true, parseOnLoad: true">
		</script>
		
		<meta rel="rdf:type" href="http://www.w3.org/2002/07/owl#Individual" />
		<meta rel="rdf:type" href="http://www.w3.org/2003/01/geo/wgs84_pos#SpatialThing" />
		<?php
		/*
		if ($hike_id != NULL) {
			echo "<meta rel=\"foaf:isPrimaryTopicOf\" href=\"http://sognefjord.vestforsk.no/page/hike/". $hike_id ."\" />";
		}
		*/
		?>
		
	</head>
	<body onload="initialize()">
		<div id="page-wrapper"><div id="page">
		
	<!-- Map -->
	<div id="sognefjord-banner"><div class="section">
		<p>sognefjord-banner</p>
	</div></div> <!-- /.section, /#sognefjord-banner -->
		
	<div id="main-wrapper"><div id="main" class="clearfix">
	
		<div id="content" class="column"><div class="section">
		<?php
		if ($hike_title != NULL) {
			//echo "<h1>". $hike_title ."</h1>";
			echo "<h1 property=\"dct:title\" content=\"". $hike_title ."\">". $hike_title ."</h1>";
		}
		if ($hike_ingress != NULL) {
			echo "<p>". $hike_ingress ."</p>";
		}
		if ($hike_description != NULL) {
			echo htmlspecialchars_decode($hike_description);
		}
		if ($hike_image != NULL) {
			echo "<p><img src=\"". $hike_image ."\"/></p>";
		}
		?>
		</div></div> <!-- /.section, /#content -->
		
		<div id="sidebar-wrapper"><div id="main" class="clearfix">
		<div id="sidebar-fact-box">
		<h2>Facts</h2>
		<?php
		if ($hike_duration != NULL) {
			echo	"<div class=\"fact_box\" rel=\"owl-time:duration\">";
			echo		"<h3>Duration</h3>";
			echo		"<span property=\"owl-time:minute\">";
			echo			$hike_duration;
			echo		"</span>";
			echo		" minutes";
			echo	"</div>";
		}
		if ($hike_length != NULL) {
			echo	"<div class=\"fact_box\" rel=\"sf_ont:Length\">";
			echo		"<h3>Length</h3>";
			echo		"<span property=\"sf_ont:Kilometer\">";
			echo			$hike_length;
			echo		"</span>";
			echo		" kilometer";
			echo	"</div>";
		}
		if ($hike_profile != NULL) {
			echo	"<div class=\"fact_box\" rel=\"sf_ont:Profile\">";
			echo		"<h3>Profile</h3>";
			echo		"<a href=\"". $hike_profile ."\" target=\"_blank\"><img src=\"". $hike_profile ."\" width=\"350\"/></a>";
			echo	"</div>";
		}
		if ($hike_minimum_elevation != NULL) {
			echo	"<div class=\"fact_box\" rel=\"sf_ont:minimumElevation\">";
			echo		"<h3>Minimum elevation</h3>";
			echo		"<span property=\"ucum:meter\">";
			echo			$hike_minimum_elevation;
			echo		"</span>";
			echo		" meter";
			echo	"</div>";
		}
		if ($hike_maximum_elevation != NULL) {
			echo	"<div class=\"fact_box\" rel=\"sf_ont:maximumElevation\">";
			echo		"<h3>Maximum elevation</h3>";
			echo		"<span property=\"ucum:meter\">";
			echo			$hike_maximum_elevation;
			echo		"</span>";
			echo		" meter";
			echo	"</div>";
		}
		if ($hike_difference_in_elevation != NULL) {
			echo	"<div class=\"fact_box\" rel=\"sf_ont:differenceInElevation\">";
			echo		"<h3>Difference in elevation</h3>";
			echo		"<span property=\"ucum:meter\">";
			echo			$hike_difference_in_elevation;
			echo		"</span>";
			echo		" meter";
			echo	"</div>";
		}
		if ($hike_height_increase != NULL) {
			echo	"<div class=\"fact_box\" rel=\"sf_ont:heightIncrease\">";
			echo		"<h3>Height increase</h3>";
			echo		"<span property=\"ucum:meter\">";
			echo			$hike_height_increase;
			echo		"</span>";
			echo		" meter";
			echo	"</div>";
		}
		if ($hike_height_decrease != NULL) {
			echo	"<div class=\"fact_box\" rel=\"sf_ont:heightDecrease\">";
			echo		"<h3>Height decrease</h3>";
			echo		"<span property=\"ucum:meter\">";
			echo			$hike_height_decrease;
			echo		"</span>";
			echo		" meter";
			echo	"</div>";
		}
		if ($hike_same_as != NULL) {
			echo	"<div class=\"fact_box\" rel=\"owl:sameAs\">";
			echo		"<h3>Same as</h3>";
			echo		"<a href=\"". $hike_same_as ."\" target=\"_blank\">". $hike_same_as ."</a><br>";
			echo	"</div>";
		}
/*
	$				= get_value_from_endpoint_reply($responseArray, "hike_start_of_lat");
	$				= get_value_from_endpoint_reply($responseArray, "hike_start_of_long");
	$			= get_value_from_endpoint_reply($responseArray, "hike_start_of_altitude");
	$				= get_value_from_endpoint_reply($responseArray, "hike_end_of_lat");
	$				= get_value_from_endpoint_reply($responseArray, "hike_end_of_long");
	$			= get_value_from_endpoint_reply($responseArray, "hike_end_of_altitude");
	$						= get_value_from_endpoint_reply($responseArray, "hike_path");
*/
		if (	$hike_start_of_lat		!= NULL AND
				$hike_start_of_long		!= NULL AND
				$hike_start_of_altitude	!= NULL
		) {
			echo	"<div class=\"hide_fact_box\" rel=\"sf_ont:StartOf\">";
			echo		"<h3>Start of</h3>";
			echo		"<span property=\"geo:lat\">". $hike_start_of_lat ."</span>";
			echo		"<span property=\"geo:long\">". $hike_start_of_long ."</span>";
			echo		"<span property=\"geo:altitude\">". $hike_start_of_altitude ."</span>";
			echo	"</div>";
		}
		if (	$hike_end_of_lat		!= NULL AND
				$hike_end_of_long		!= NULL AND
				$hike_end_of_altitude	!= NULL
		) {
			echo	"<div class=\"hide_fact_box\" rel=\"sf_ont:EndOf\">";
			echo		"<h3>End of</h3>";
			echo		"<span property=\"geo:lat\">". $hike_end_of_lat ."</span>";
			echo		"<span property=\"geo:long\">". $hike_end_of_long ."</span>";
			echo		"<span property=\"geo:altitude\">". $hike_end_of_altitude ."</span>";
			echo	"</div>";
		}
		if ($hike_path != NULL) {
			echo	"<div class=\"hide_fact_box\" rel=\"sf_ont:Path\">";
			echo		"<h3>Path</h3>";
			echo		"<span property=\"sf_ont:GoogleEncodedPath\">";
			echo			$hike_path;
			echo		"</span>";
			echo		" meter";
			echo	"</div>";
		}
		?>
		</div> <!-- /#sidebar-fact-box -->
		<div id="sidebar-weather-box">
		</div> <!-- /#sidebar-weather-box -->
		</div></div> <!-- /#main, /#sidebar-wrapper -->
	</div></div> <!-- /#main, /#main-wrapper -->
		
	<div id="footer"><div class="section">
		<p>sognefjord.vestforsk.no</p>
	</div></div> <!-- /.section, /#footer -->
		
		</div></div> <!-- /#page, /#page-wrapper -->
	</body>
</html>
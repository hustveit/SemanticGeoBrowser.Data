<!DOCTYPE HTML>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Selected hike</title>
		<link rel="stylesheet" href="layout.css" media="screen">
		<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/dojo/1.6/dijit/themes/claro/claro.css" media="screen">
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?libraries=geometry&amp;sensor=false"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/dojo/1.6.0/dojo/dojo.xd.js"
				data-dojo-config="isDebug: true, parseOnLoad: true">
		</script>
		<script>
			dojo.require("dojo.io.script");
			dojo.require("dojo.DeferredList");
			dojo.require("dijit.form.Button");
			dojo.require("dijit.form.TextBox");
			

		</script>
		<script type="text/javascript" src="script_hikes.js"></script>
	</head>
	<body class="claro">
		<div id="page-wrapper"><div id="page">
		
	<!-- Map -->
	<div id="sognefjord-banner"><div class="section">
		<p>sognefjord-banner</p>
	</div></div> <!-- /.section, /#sognefjord-banner -->
		
	<div id="main-wrapper"><div id="main" class="clearfix">
		
		<div id="content" class="column"><div class="section">
			<div id="content-top">
				<h1>Hikes</h1>
			</div> <!-- /#content-top -->
		

		
		
		
		</div></div> <!-- /.section, /#content -->
		<div id="sidebar-wrapper"><div id="main" class="clearfix">
		<div id="sidebar-sort-box">
			<h2>Search criteria</h2>
			<form name="form_hike_criteria" action="">
				<h3>Minimum duration</h3>
				<input type="text" name="input_min_duration_name" disabled="false" id="input_min_duration_id" size="10" value="" class="text-input"><br><br>
				<h3>Maximum duration</h3>
				<input type="text" name="input_max_duration_name" disabled="false" id="input_max_duration_id" size="10" value="" class="text-input"><br><br>
				<h3>Minimum length</h3>
				<input type="text" name="input_min_length_name" disabled="false" id="input_min_length_id" size="10" value="" class="text-input"><br><br>
				<h3>Maximum length</h3>
				<input type="text" name="input_max_length_name" disabled="false" id="input_max_length_id" size="10" value="" class="text-input"><br><br>
				<button id="dojo_toggle_button_id"></button>
			</form>
		</div> <!-- /#sidebar-sort-box -->
		</div></div> <!-- /#main, /#sidebar-wrapper -->
	</div></div> <!-- /#main, /#main-wrapper -->
		
	<div id="footer"><div class="section">
		<p>sognefjord.vestforsk.no</p>
	</div></div> <!-- /.section, /#footer -->
		
		</div></div> <!-- /#page, /#page-wrapper -->
	</body>
    <script type="text/javascript">
		//Lagar button til hike ved å bruke "id"
		dojo.ready(function(){
			new dijit.form.ToggleButton({
				checked: true, //Skiftar mellom true and false, startar med true
				onClick: function(){
					if(this.checked) { //if "true"
						//alert("true");
						
						//get and set form input
						//these var are defined in script_hikes.js
						duration_min_input = dijit.byId('input_min_duration_id').get('value');
						duration_max_input = dijit.byId('input_max_duration_id').get('value');
						length_min_input = dijit.byId('input_min_length_id').get('value');
						length_max_input = dijit.byId('input_max_length_id').get('value');
						
						this.set('label',"Clear search");
						initialize();
					}
					else if(!this.checked) { //if "false"
						//alert("false");
						this.set('label',"Search");
						
						delete_markers(markers);
						reset_content_list();
						reset_map_position();
					}
				},
				label: "Clear search" //Knappen startar med denne labelen
			}, "dojo_toggle_button_id");
			
			new dijit.form.TextBox({
				placeHolder: "in minutes"
			}, "input_min_duration_id");
			
			new dijit.form.TextBox({
				placeHolder: "in minutes"
			}, "input_max_duration_id");
			
			new dijit.form.TextBox({
				placeHolder: "in kilometers"
			}, "input_min_length_id");
			
			new dijit.form.TextBox({
				placeHolder: "in kilometers"
			}, "input_max_length_id");
			
			initialize();
		}); //END dojo.ready()
    </script>
</html>



function create_start_and_end_triples(
	path_in_an_array,
	thing_name
){
	var create_start_and_end_triples_deferred = new dojo.Deferred();
	
	var last_index_in_array = path_in_an_array.length - 1;
	
	if(path_in_an_array.length > 1){
		
		var start_point = path_in_an_array[0];
		var end_point = path_in_an_array[last_index_in_array];
		
		dojo.xhrPost({ //HTTP POST REQUEST
			url: "create_start_and_end_triples.php",
			content: {
				start_point: start_point,
				end_point: end_point
			},
			handleAs: "text",
			handle: function(response, ioArgs) { // The callback that fires regardless of request success or failure.
				return response;
			}
		}).then(function(saved_if_true){
			create_start_and_end_triples_deferred.resolve(saved_if_true);
		});
	}
	else {
		create_start_and_end_triples_deferred.resolve("false");
	}
	
	return create_start_and_end_triples_deferred;
} //END create_start_and_end_triples()
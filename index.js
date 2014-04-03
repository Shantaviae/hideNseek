	function initialize() {
		var mapOptions = {
			center: new google.maps.LatLng(-34.397, 150.644),
			zoom: 17,
			mapTypeControl: false,
			streetViewControl: false
		};

		var map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);
		var mapDiv = document.getElementById("map-canvas");
	//	var person = prompt("Please enter your name");
	//	var contents = person+" is here.\n Happy BirthDay! Mochen Anhe"
	var contents = "Click here"
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			var pos  = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude);
			var infowindow = new google.maps.InfoWindow({
				map: map,
				position: pos,
				content: contents

			});

			map.setCenter(pos);

			google.maps.event.addDomListener(mapDiv,"click",showAlert);

		//========================================================	
	},function(){
		handleNoGeolocation(true);
	});
	}
	else {
		// Browser doesn't support Geolocation
		handleNoGeolocation(false);
	}
	}

	function showAlert(){
		window.alert("Got You!");
	}


	function handleNoGeolocation(errorFlag) {
		if (errorFlag) {
			var content = 'Error: The Geolocation service failed.';
		} else {
			var content = 'Error: Your browser doesn\'t support geolocation.';
		}

		var options = {
			map: map,
			position: new google.maps.LatLng(60, 105),
			content: content
		};

		var infowindow = new google.maps.InfoWindow(options);
		map.setCenter(options.position);
	}

	google.maps.event.addDomListener(window, 'load', initialize);
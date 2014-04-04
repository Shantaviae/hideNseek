	
var prevpos;
	function initialize() {
		var mapOptions;
		var pos;
		
		 mapOptions = {
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
	refreshLocation(map);
	window.setInterval(function(){refreshLocation(map);},5000);
	
	}

	function refreshLocation(map){
		
		if (navigator.geolocation){
			console.log("geolocation");
		navigator.geolocation.getCurrentPosition(function(position){
			var pos  = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude)

				map.setCenter(pos);

				var image = "icon-current-location.png"
				var marker = new google.maps.Marker({
					map:map,
					position:pos,
					icon: image

				});
							
			var infowindow = new google.maps.InfoWindow({
				content :"Got You!"
			});

			google.maps.event.addDomListener(marker,"click",function(){
				infowindow.open(map,marker);
			});
			
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
		
		
/*
*
*   Use parse.com as the backend data storage
*
*   Data management implementations located here
*
*
*/
	//initialize Parse
	Parse.initialize("aR9gbvkk28bU16g4LDJ6jvLpn4qnEsqqFhllK42y", "JJpfwU0S7FFWqzDSTu67CAmxH3YzyUGRdFyGYGbs");
	//run a test
	var TestObject = Parse.Object.extend("TestObject");
	var testObject = new TestObject();
		testObject.save({foo: "bar"}).then(function(object) {
		alert("yay! it worked");
	});

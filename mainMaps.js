	
var line;
var prevpos;
var mapOptions;
var map;
var locationUpdateTimer;

	

	function point(x,y){
		this.x = x;
		this.y = y;
	}

	function initialize() {

		// set up timer loop
		locationUpdateTimer = new Timer(60);
		locationUpdateTimer.setSpeed(10); // 10 times faster than real life
		locationUpdateTimer.onTimeOut(function() {
			console.log("get new locs");
			requestPlayerData();
			// reset and restart the loop
			this.reset();
			this.start();
		});

		locationUpdateTimer.onStart(function(curTime) {
			document.getElementById("updateTimer").innerHTML = locationUpdateTimer.toString(curTime);
		});
		locationUpdateTimer.onTick(function(curTime) {
			document.getElementById("updateTimer").innerHTML = locationUpdateTimer.toString(curTime);
		});
			
		mapOptions = {
			center: new google.maps.LatLng(45, 45),
			zoom: 20,
			mapTypeControl: false,
			streetViewControl: false

		};

		map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);

		// center map on user on resize
		google.maps.event.addDomListener(map, 'resize', function(event) {
			updateUserLocation(function(pos) {
				map.setCenter(pos);
			});
			
		});

		updateUserLocation(function(pos) {
			
			// Initialize center of map and add user
			map.setCenter(pos);						
			addUser(pos.k, pos.A);

			window.setInterval(smoothUserLocation(),6000); // refresh user location every 30 seconds
		});		 
	
	}
	//For Deleting the users who are leaving
	function exitUser()
	{
//	alert('Back_test');
	deleteUser(player);
	//showPage("#home");
    	}
	

	function updateMarker(user){
		var location = new google.maps.LatLng(user.getLat(),user.getLon());
		user.marker.setPosition(location);
	}


	function makeMarker(user) {
		var url;

		if (user === player) {
			url = "images/user_";
		} else {
			url = "images/marker_";
		}

		if (user.isSeeker()) {
			url = url + "seeker.png";
		} else {
			url = url + "hider.png";
		} 

		var image = {
			url: url,
			scaledSize: new google.maps.Size(30,30)
		};

		var location = new google.maps.LatLng(user.getLat(),user.getLon());
		var marker = new google.maps.Marker({
			map:map,
			position:location,
			icon: image

		});

		// add event listener
		if (user !== player) {
			google.maps.event.addListener(marker, 'click', function() {
				var infowindow;
				if ((!user.isSeeker()) && (player.isSeeker())) {
					
					var currentHider = marker.position;

					var p2 = new point(currentHider.k,currentHider.A);
				  	var p1 = new point(player.getLat(),player.getLon());
				  	console.log(p1);
				  	console.log(p2);
					var distance = lineDistance(p1,p2)*100000;
					console.log("the distance is " + distance);
					if ( distance <= 15){
						var infowindow = new google.maps.InfoWindow({
							content :"Got You!"
						});
				// Now, the userclass is seeker !
						user.setIsSeeker(true);
						saveToServer(user);

		                // if (allHidersTagged(users)) {
		                // 	gameTimer.stop();
		                // 	locationUpdateTimer.stop();
		                // }
						
					}
					else {
						infowindow = new google.maps.InfoWindow({
							content :"You are too far!"
						});
					}
				} else if (user.isSeeker()) {
					infowindow = new google.maps.InfoWindow({
						content :"Can't tag a seeker!"
					});
				} else {
					infowindow = new google.maps.InfoWindow({
						content :"Can't tag when you are a hider!"
					});
				}


				infowindow.open(map,marker);
			});
		}

		user.marker = marker;
		user.marker.setPosition(location);

		console.log("Made marker");
						
	}

	function clearMarkers() {
		for (var i = 0; i < users.length; i++) {
			if (users[i].marker) {
				users[i].marker.setMap(null); // removes marker from map
			}
		}
		player.marker.setMap(null);
	}

	function updateUserLocation(callback) {
		if (navigator.geolocation) {	
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos  = new google.maps.LatLng(position.coords.latitude,
					position.coords.longitude)
				callback(pos);
			}, 
				function() {
					handleNoGeolocation(true);
			});
		} else {
			// Browser doesn't support Geolocation
			handleNoGeolocation(false);
		}		
	}


	//This is for calculating the average of location data every 5 seconds
	function smoothUserLocation() {
		// use closure to store private data with this function
		var i = 0;
		var userLocations = new Array(5);

		var f = function() {
			updateUserLocation(function(pos) {
				userLocations[i] = pos;
				if (i == 4) {
					refreshLocation(userLocations, map);

				}
				i  = (i+1) % 5;	
			});
		};

		return f;
	}

	//this is for refreshing the current seeker locations
	function refreshLocation(user_locations, map) {
		console.log("refresh user loc");
		var latitude = 0;
		var longitude = 0;

		for(var i = 0;i<5;i++) {
			latitude += user_locations[i].k;
			longitude +=user_locations[i].A; 
		}
		latitude /=5;
		longitude /=5;	


		var pos = new google.maps.LatLng(latitude,longitude);
		map.setCenter(pos);

		player.setLat(pos.k);
		player.setLon(pos.A);
		saveToServer(player);
		updateMarker(player);	
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

		throw new Error("Error with geolocation.");
	}

	function showError(error){
	  switch(error.code) 
	    {
	    case error.PERMISSION_DENIED:
	      alert("User denied the request for Geolocation.")
	      break;
	    case error.POSITION_UNAVAILABLE:
	      x.innerHTML="Location information is unavailable."
	      break;
	    case error.TIMEOUT:
	      x.innerHTML="The request to get user location timed out."
	      break;
	    case error.UNKNOWN_ERROR:
	      x.innerHTML="An unknown error occurred."
	      break;
	    }
  }

	function lineDistance( point1, point2 ) {
		var xs = 0;
	  	var ys = 0;
	 
	  	xs = point2.x - point1.x;
	  	xs = xs * xs;
	 
	  	ys = point2.y - point1.y;
	  	ys = ys * ys;
	 
	  	return Math.sqrt( xs + ys );
	}

	function allHidersTagged(hiders){
		console.log(hiders);
		var len = hiders.length;
		for (var j = 0 ;j<len;j++) {
			if (!hiders[j].isSeeker()) {
				return false;
			}
		}
		return true;
	}



// ****************************** Old functions **************************
// Not used anymore

function moveHiders() {
	// TODO remove hardcoding!!!
	moveHider(hiders[0],map,"down");
	moveHider(hiders[1],map,"up");
	moveHider(hiders[2],map,"left");
	moveHider(hiders[3],map,"right");
}

function moveHider(hider,map,action){

	// we only move untagged hiders
	if (hider.isTagged) {
		return;
	}

	var marker = hider.marker;
	var markerLocation = marker.position;

	var lk = markerLocation.k;
	var lA = markerLocation.A;


	switch (action){
		case "down":
			 //lk = lk + 0.00001;
			 lA = lA - 0.00001;
			 break;
		case "up":
			 //lk = lk + 0.00001;
			 lA = lA + 0.00001;
			 break;
		case "left":
			 lk = lk + 0.00001;
			 //lA = lA - 0.00001;
			 break;
		case "right":
			 lk = lk - 0.00001;
			 //lA = lA - 0.00001;
			 break;
	}
		

	var newlocation = new google.maps.LatLng(lk,lA);
	marker.setPosition(newlocation);

}

function Hider(ID,currentLocation,isTagged,marker){

		//this.playerName = playerName;
		//this.startTime = startTime;
		this.ID = ID;
		this.currentLocation = currentLocation;
		this.isTagged = isTagged;
		this.marker = marker;

		// closure variable to bind click event to this hider
		var hider = this;

		//==================This is for tapping hiders===================//		
		google.maps.event.addListener(this.marker, 'click', function() {

			var currentSeeker = seekers[0].currentLocation;
			var currentHider = marker.position;

			var p2 = new point(currentHider.A,currentHider.k);
		  	var p1 = new point(currentSeeker.A,currentSeeker.k);
			var distance = lineDistance(p1,p2)*100000;
			console.log("the distance is " + distance);
			if ( distance <= 15){
				var infowindow = new google.maps.InfoWindow({
					content :"Got You!"
				});

				hider.isTagged = true;
                if (allHidersTagged(hiders)) {
                	gameTimer.stop();
                	locationUpdateTimer.stop();
                }
				
			}
			else {
				var infowindow = new google.maps.InfoWindow({
					content :"You are too far!"
				});
			}	

			infowindow.open(map,marker);
		});
	}


	function Seeker(currentLocation,marker){
		//this.playerName = playerName;
		//this.startTime = startTime;
		this.currentLocation = currentLocation;
		this.marker = marker;
	}

	function makeHiders(pos){
			var posk = pos.k;
			var posA = pos.A;		
		

			var pos1 = new google.maps.LatLng(pos.k,pos.A+0.0001);
			var pos2 = new google.maps.LatLng(pos.k-0.0001,pos.A);
			var pos3 = new google.maps.LatLng(pos.k,pos.A-0.0001);
			var pos4 = new google.maps.LatLng(pos.k+0.0001,pos.A);

			var hider1 = new Hider(0,pos1,false,addHider(pos1,map));
			var hider2 = new Hider(0,pos2,false,addHider(pos2,map));
			var hider3 = new Hider(0,pos3,false,addHider(pos3,map));
			var hider4 = new Hider(0,pos4,false,addHider(pos4,map));

			hiders.push(hider1);
			hiders.push(hider2);
			hiders.push(hider3);
			hiders.push(hider4);

			locationUpdateTimer.start();
	}


	function addHider(location,map){
		var image = {
	    	url: 'marker_hider.png',
	    	// This marker is 20 pixels wide by 32 pixels tall.
	    	size: new google.maps.Size(24, 24),
	    	scaledSize: new google.maps.Size(24,24)
	    	// The origin for this image is 0,0
	  	};

		var marker = new google.maps.Marker({
			url: 'marker_hider.png',
	    	// This marker is 2oogle.maps.Marker({
			map:map,
			position:location,
			icon: image

		});

		return marker;
							
	}



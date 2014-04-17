	
var line;
var prevpos;
var user_locations = new Array(5);
var i = 0;
var mapOptions;
var curLocation;
var hiders =  new Array();
var seekers = new Array();
var map;


    $( document ).ready(function() {

    	var seeker = new Seeker(null,null);
    	seekers.push(seeker);
    });




	//google.maps.event.addDomListener(window, 'load', initialize);
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
                window.clearInterval(hider.ID);
                if (allPlayersTagged()) {
                	gameTimer.stop();
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

	function allPlayersTagged() {
		var result = true;
		for (var i=0; i < hiders.length; i++) {
			result = result && hiders[i].isTagged;
		}
		return result;
	}

	function Seeker(currentLocation,marker){
		//this.playerName = playerName;
		//this.startTime = startTime;
		this.currentLocation = currentLocation;
		this.marker = marker;
	}

	function point(x,y){
		this.x = x;
		this.y = y;
	}

	function initialize() {
			

		var pos = getUserLocation();	
		 mapOptions = {
			center: new google.maps.LatLng(45, 45),
			zoom: 20,
			mapTypeControl: false,
			streetViewControl: false

		};
	
		map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);


		initializeLocation(map);			
			//console.log(hiders[0].currentLocation);	  	
		// center map on user on resize
		google.maps.event.addDomListener(map, 'resize', function(event) {
			initializeLocation(map);
		});

		window.setInterval(function(){collectData(map);},5000);

		return map;
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
			hider1.ID = window.setInterval(function(){moveHider(hider1,map,"down");},1000);
			hider2.ID = window.setInterval(function(){moveHider(hider2,map,"up");},1000);
			hider3.ID = window.setInterval(function(){moveHider(hider3,map,"left");},1000);
			hider4.ID = window.setInterval(function(){moveHider(hider4,map,"right");},1000);
	}
	// Use the DOM setInterval() function to change the offset of the symbol
	// at fixed intervals.

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

	function moveHider(hider,map,action){
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

	function addSeeker(location,map){
		var image = "marker_seeker.png"

		var marker = new google.maps.Marker({
			map:map,
			position:location,
			icon: image

		});
		if (seekers[0].marker!=null)
			seekers[0].marker.setMap(null);
		seekers[0].marker = marker;
		seekers[0].currentLocation = location;						
	}


	function initializeLocation(map){
		if (navigator.geolocation){
			
			navigator.geolocation.getCurrentPosition(function(position){
				var pos  = new google.maps.LatLng(position.coords.latitude,
					position.coords.longitude)
					map.setCenter(pos);	
					addSeeker(pos,map);
					
			},function(){
				handleNoGeolocation(true);
			});
		} else {
			// Browser doesn't support Geolocation
			handleNoGeolocation(false);
		}	
	}

	function getUserLocation(){
		
		if (navigator.geolocation){
			
		navigator.geolocation.getCurrentPosition(positionHelper,function(){
				handleNoGeolocation(true);
		});	
		 }
			else {
				// Browser doesn't support Geolocation
				alert("Browser doesn't support Geolocation");
			}
		return curLocation;		
		}
	function positionHelper(position){
		var pos  = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude);
			curLocation = pos;
		
	}	

	//This is for calculating the average of location data every 5 seconds
	function collectData(map){
		if (navigator.geolocation){
			
		navigator.geolocation.getCurrentPosition(function(position){
			var pos  = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude)

				//map.setCenter(pos);
				user_locations[i] = pos;
				//console.log(pos);
				//console.log(pos.A);
				//console.log(pos.k);	
				//when I == 4, we have collected 5 locations, and then refresh
				if (i == 4){
				refreshLocation(user_locations,map);
				}
				i  = (i+1) % 5;
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

//this is for refreshing the current seeker locations
	function refreshLocation(user_locations,map){
		var latitude = 0;
		var longitude = 0;

		for(var i = 0;i<5;i++){
				latitude += user_locations[i].k;
				longitude +=user_locations[i].A; 
		}
		latitude /=5;
		longitude /=5;	


		var pos = new google.maps.LatLng(latitude,longitude);
		map.setCenter(pos);
		//console.log(pos);
		//var image = "marker_seeker.png"
		addSeeker(pos,map);
			
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

	function lineDistance( point1, point2 )
		{
		  var xs = 0;
		  var ys = 0;
		 
		  xs = point2.x - point1.x;
		  xs = xs * xs;
		 
		  ys = point2.y - point1.y;
		  ys = ys * ys;
		 
		  return Math.sqrt( xs + ys );
		}
	function checktag(hiders){

		var len = hiders.length;
		for (var j = 0 ;j<len;j++){
			if (hiders[j].isTagged == false)
				return false;
		}
		return true;
	}
	

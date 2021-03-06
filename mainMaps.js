	
var line;
var prevpos;
var user_locations = new Array(5);
var i = 0;
var mapOptions;
var curLocation;
var hiders =  new Array();
var seekers = new Array();


    $( document ).ready(function() {

    	var seeker = new Seeker(null,null);
    	seekers.push(seeker);
    });

	google.maps.event.addDomListener(window, 'load', initialize);


	function Hider(currentLocation,isTagged,marker){
		//this.playerName = playerName;
		//this.startTime = startTime;
		this.currentLocation = currentLocation;
		this.isTagged = isTagged;
		this.marker = marker;
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

	function game(gameName,totalTime){

	}

	function initialize() {
			
		var pos = getUserLocation();	
		 mapOptions = {
			center: new google.maps.LatLng(45, 45),
			zoom: 20,
			mapTypeControl: false,
			streetViewControl: false

		};
	
		var map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);


		initializeLocation(map);
		google.maps.event.addDomListener(map, 'click', function(event){
			
			var pos = event.latLng;
			
			var hider = new Hider(pos,false,addHider(pos,map));
			hiders.push(hider);
			//console.log(hiders[0].currentLocation);	  
			console.log("this is K "+hider.currentLocation.A+"   this is A:"+hider.currentLocation.k+ "\n");
		});

		window.setInterval(function(){collectData(map);},1000);
	}

	// Use the DOM setInterval() function to change the offset of the symbol
	// at fixed intervals.
	function animateCircle(){
		var count = 0;
	    window.setInterval(function() {
	      count = (count + 10) % 200;

	      var icons = line.get('icons');
	      icons[0].offset = (count / 2) + '%';
	      line.set('icons', icons);
	  }, 20);
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
			map:map,
			position:location,
			icon: image

		});

		// var lineCoordinates = [
		//     new google.maps.LatLng(location.k ,location.A),
		//     new google.maps.LatLng(location.k*1.000001, location.A*1.000001)
		//   ];

		//   // Create the polyline and add the symbol to it via the 'icons' property.
		//   line = new google.maps.Polyline({
		//     path: lineCoordinates,
		//     icons: [{
		//       icon: image,
		//       offset: '100%'
		//     }],
		//     map: map
		//   });
		//  // line.setVisible(false);
		//   animateCircle();
//==================This is for tapping hiders===================//		
		google.maps.event.addListener(marker, 'click', function() {

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
				}
				else {
					var infowindow = new google.maps.InfoWindow({
						content :"You are too far!"
					});
				}	
					infowindow.open(map,marker);
				});
		return marker;
							
	}

	

	function addSeeker(location,map){
		var image = "marker_seeker.png"

		var marker = new google.maps.Marker({
			map:map,
			position:location,
			icon: image

		});
		seekers[0].marker = marker;
							
	}
	function initializeLocation(map){
		if (navigator.geolocation){
			
		navigator.geolocation.getCurrentPosition(function(position){
			var pos  = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude)
				map.setCenter(pos);	
				addSeeker(pos,map);

				seekers[0].currentLocation = pos;
				
	
	},function(){
		handleNoGeolocation(true);
	});
	}
	else {
		// Browser doesn't support Geolocation
		handleNoGeolocation(false);
	}	
	}

	function getUserLocation(){
		
		if (navigator.geolocation){
			
		navigator.geolocation.getCurrentPosition(positionHelper,showError);
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
	},showError);
	}
	else {
		// Browser doesn't support Geolocation
		alert("Browser doesn't support Geolocation");
	}
	}


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
		var image = "marker_seeker.png"

		//if (prevpos != null) prevpos.setMap(null);	
		var marker = new google.maps.Marker({
			map:map,
			position:pos,
			icon: image

		});
		seekers[0].marker.setMap(null);
		seekers[0].marker = marker;
		//prevpos = marker;					
			

			
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
	
	
		
	
     

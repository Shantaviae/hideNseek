	
var line;
var prevpos;
var user_locations = new Array(5);
var i = 0;
var mapOptions;
var curLocation;
var hiders =  new Array();
var seekers = new Array();
var handler;
var divSpeed =1000;

    $( document ).ready(function() {

    	var seeker = new Seeker(null,null);
    	seekers.push(seeker);
    });



	//google.maps.event.addDomListener(window, 'load', initialize);
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

	function initialize() {
			

		handler = setInterval("decrementValue('divTimer')", divSpeed);	

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

		// center map on user on resize
		google.maps.event.addDomListener(map, 'resize', function(event) {
			initializeLocation(map);
		});

		window.setInterval(function(){collectData(map);},1000);

		return map;
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
			map:map,
			position:location,
			icon: image

		});

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
	
	
		
function stop(tag) {
    clearInterval(handler);
    if (tag == false){
		alertify.alert('Time up! You lose!');
        //alert("Time up! You lose!");
    }
    else{
		alertify.alert('Congrats! You win!');
        //alert("Congrats! You win!");
    }
}

function parseTimer(timer) {
    var time = document.getElementById(timer).innerHTML;
    var times = time.split(":");
    var cTime = parseInt(times[0], 10)*60 + parseInt(times[1], 10);
    return cTime;
}

function revertTime(timeNum) {
    var seconds = timeNum % 60;
    var minutes = (timeNum - seconds) / 60;
	
	var pTime;
	
	if (seconds < 10) {
		pTime = minutes + ":0" + seconds;
	}
	if (minutes < 10) {
		pTime = "0" + minutes + ":" + seconds;
	}
	if (minutes < 10 & seconds < 10) {
		pTime = "0" + minutes + ":0" + seconds;
	}
	if (minutes >= 10 & seconds >= 10) {
		pTime = minutes + ":" + seconds;
	}
	
    return pTime;
}



function decrementValue(timer) {
 	var timer;
     var curTime = parseTimer(timer);
    if ( curTime > 0){
        
        curTime = curTime - 1;
        document.getElementById(timer).innerHTML = revertTime(curTime);
    }
    else 
    {
        
 			stop(false);
 		
    }
}
     

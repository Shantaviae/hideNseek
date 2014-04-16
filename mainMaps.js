	
//this is fracnis parse
Parse.initialize("nRtaCbEgJ6jjaVWdXQncS9Ac8Wf7UtNrRlV2mtOH", "oFiopQ3Gw1kVF6qCgeY0uKdMbo9g0AVaJ3oqymVp");

//this is webpage parse;
//Parse.initialize("UH0vJUKo17FcCgOJPX6KFAmK0DxnQwCKtV4yQwva", "HwdLU8EQA6IIXP10n9ovZgnAJAwk1P5qzwlK5Clu");


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
	function Hider(ID,currentLocation,isTagged,marker,userclass){

		//this.playerName = playerName;
		//this.startTime = startTime;
		this.ID = ID;
		this.currentLocation = currentLocation;
		this.isTagged = isTagged;
		this.marker = marker;
		this.userclass = userclass;
	}

	function Seeker(ID,currentLocation,marker,userclass){
		this.ID = ID;
		//this.playerName = playerName;
		//this.startTime = startTime;
		this.currentLocation = currentLocation;
		this.marker = marker;
		this.userclass = userclass;
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
		seekers[0].ID = -1;
		seekers[0].marker = marker;
		seekers[0].currentLocation = location;
		seekers[0].userclass = "seeker";	

		
		
	}

	function saveToServer(location){

		var Player = Parse.Object.extend("Player");
		var query = new Parse.Query(Player);

		query.find({
		  success: function(results) {
		    //alert("Successfully retrieved " + results.length + "");
		    // Do something with the returned Parse.Object values
		    if (results.length >0){
		    // if the database has results, we assume that there are seekers and hiders  in the array of results.
		    for (var i = 0; i < results.length; i++) { 
		      var object = results[i];
		      //alert(object.id + ' - ' + object.get('userID'));
		      var parseUserID = object.get('userID');
		      var parseUserClass = object.get('userclass');
		      // this is for updating the existing seeker.
		      if (parseUserID == -1 && parseUserClass == "seeker"){

		      	//var marker  = makeMarker(location);
		      	var seeker = new Seeker(-1,location,makeMarker(location),"seeker");	
		      	seekers[0] = seeker;
		      	updateMarker(location,seekers[0]);


		      	object.save(null, {
					  success: function(object) {
					    // Now let's update it with some new data. In this case, only cheatMode and score
					    // will get sent to the cloud. playerName hasn't changed.
					    object.set("latitude", location.k);
						object.set("longitude", location.A);
					    object.save();
					    //alert("location updated to Server")
					  }
					});
		        }
		        else if (parseUserClass == "hider" &&
		         parseUserID == user.ID){
		        	object.save(null, {
					  success: function(object) {
					    // Now let's update it with some new data. In this case, only cheatMode and score
					    // will get sent to the cloud. playerName hasn't changed.
					    object.set("latitude", location.k);
						object.set("longitude", location.A);
					    object.save();
					    //alert("location updated to Server")

					  }
					});
		        	}
			    
					}
				}
				// the database is null, so we create a new object for this user and make him as seeker;
					else {					
					var player = new Player();
					player.set("userID",-1);
					player.set("latitude", location.k);
					player.set("longitude", location.A);
					player.set("userclass","seeker");
					player.save(null, {
					  success: function(player) {
					    // Execute any logic that should take place after the object is saved.
					    //alert('New object created with objectId: ' + player.id);
					  },
					  error: function(player, error) {
					    // Execute any logic that should take place if the save fails.
				    // error is a Parse.Error with an error code and description.
					    alert('Failed to create new object, with error code: ' + error.description);
					  }
					});

					
					var seeker = new Seeker(-1,location,makeMarker(location),"seeker");	
					seekers.push(seeker);
			
				}
				  },
				  error: function(error) {
				   alert("Error: " + error.code + " " + error.message);
				  }
				});
				
				
			}

function makeMarker(location){

	var image = "marker_seeker.png"

	var marker = new google.maps.Marker({
		map:map,
		position:location,
		icon: image

	});
	return marker;

}

function updateMarker(location,player){

}


	function initializeLocation(map){
		if (navigator.geolocation){
			
		navigator.geolocation.getCurrentPosition(function(position){
			var pos  = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude)
				map.setCenter(pos);	
				//addSeeker(pos,map);
				saveToServer(pos);	
				//fetchFromServer();
				
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

	//This is for calculating the average of location data every 25 seconds
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

			var image = {
		    url: 'marker_hider.png',
		    // This marker is 20 pixels wide by 32 pixels tall.
		    size: new google.maps.Size(24, 24),
		    scaledSize: new google.maps.Size(24,24)
		    // The origin for this image is 0,0
		  };
			var newmarker = new google.maps.Marker({
				map:map,
				position:newlocation,
				icon: image
			});

			if (marker != null)	
				marker.setMap(null)
			hider.marker = newmarker;

			google.maps.event.addListener(newmarker, 'click', function() {

			   var currentSeeker = seekers[0].currentLocation;
			   var currentHider = newmarker.position;

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
				}
				else {
					var infowindow = new google.maps.InfoWindow({
						content :"You are too far!"
					});
				}	
					infowindow.open(map,newmarker);
				});

	}
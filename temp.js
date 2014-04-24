// Jingcheng
//Parse.initialize("UH0vJUKo17FcCgOJPX6KFAmK0DxnQwCKtV4yQwva", "HwdLU8EQA6IIXP10n9ovZgnAJAwk1P5qzwlK5Clu");

// Francis
//Parse.initialize("nRtaCbEgJ6jjaVWdXQncS9Ac8Wf7UtNrRlV2mtOH", "oFiopQ3Gw1kVF6qCgeY0uKdMbo9g0AVaJ3oqymVp");


Parse.initialize("JBOonUKeC2EOV3Z4xoqkUDUfMMPqz00BZgm2dKX2", "qTL4hD4PR8kZqp1ux8KXbwpdgNaxAddDUMY9W81G");

var playerClass;
var playerID;
var player;
var users = new Array();


var Player = Parse.Object.extend("Player", {
	//to prevent front end typo. Wrap up all gets and sets
	getId: function() {
		return this.id;
	},
	getLat: function() {
		return this.get("latitude");
	},
	getLon: function() {
		return this.get("longitude");
	},
	isSeeker: function() {
		return (this.get("userclass") === "seeker");
	},
	getCreatedAt: function() {
		return this.get("createdAt");
	},
	setLat: function(lat) {
		if (typeof(lat) === "number") {
			this.set("latitude", lat);
		}
	},
	setLon: function(lon) {
		if (typeof(lon) === "number") {
			this.set("longitude", lon);
		}
	},
	setIsSeeker: function(isSeeker) {
		if (typeof(isSeeker) === "boolean") {
			if (isSeeker) {
				this.set("userclass", "seeker");
			} else {
				this.set("userclass", "hider");
			}
		}
	}
 }, 
 {
	createNewPlayer: function(lat,long) {
	//buggy needs callbacks
		var query = new Parse.Query(Game);
		var idUnique = true;
		query.equalTo("gameId", gameId);
		query.find({
			success:function(results) {
				if (results.length == 0)
					this.createTheGame(gameId);
				else
					gameIdAlreadyExists();
			},
			error:function(){
				alert("create new game fails");
			}
		});
	}
});



// simple wrapper on the parse save method.
function saveToServer(parseObj){

	parseObj.save(null, {
		success: function(object) {
		    console.log("Save successful");
		},
	  	error: function(obj, error) {
	  		console.log("Error: " + error.code + " " + error.message);
	  	}
	});	
}



/*
function hiderView() {
	var query = new Parse.Query(Player);
	query.equalTo("userclass", "hider");
	console.log(player.getId());
	query.notEqualTo("objectId", player.getId());
	query.find({
		success:function(results){
			handleViewer(results);
		},
		error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		}
	});
}
*/


function requestPlayerData() {
	var query = new Parse.Query(Player);
	//query.notEqualTo("objectId", player.getId());

	query.find({
		success:function(results) {
			handleData(results);
		},
		error: function(error) {
			console.log("Error: " + error.code + " " + error.message);
		}
	});
}

function handleData(results) {
	var playerIndex = null;
	var playerArray;

	console.log("users: " + results.length);
	clearMarkers();

	for (var i= 0 ;i<results.length;i++){
		var obId = results[i].getId();
		if (obId == player.getId()) {
			playerIndex = i;
		}
	}

	playerArray = results.splice(playerIndex, 1);

	if (playerArray[0].isSeeker() && !player.isSeeker()) {
		alert("You are now a seeker!");
	}
	player = playerArray[0];
	makeMarker(player);

	users = results;
	console.log(users);

	for (var i = 0; i < results.length; i++) {
		if (player.isSeeker() || !results[i].isSeeker()) {
			makeMarker(results[i]);
		}
	}

	

}

function isThereASeeker() {
	var query=new Parse.Query(Player);
	query.equalTo("userclass","seeker");
	query.find({
		success:function(results){
			if(results.length!=0)
			{
			alert("true");
			return true;
			}
			else 
			{
			alert("false");
			return false;
			}
		},
		 error: function(error) 
		 {
		 }
	});
}

function addUser(lat,long)
{	/* */
		var query=new Parse.Query(Player);
		query.equalTo("userclass","seeker");
		query.find({
		success:function(results){
			if(results.length!=0) {
				var temp = new Player();
				//var Id=String(Math.random()).substring(1,7);
				//temp.set("userID",Id);
				temp.set("userclass","hider");
				temp.set("latitude",lat);
				temp.set("longitude",long);
				temp.save(null, {
						success: function(temp) {
							handleNewUser(temp);
						},
						error: function(temp, error) {
							console.log(error);
						}

					});

				console.log("hider");
			} else {
				var temp = new Player();
				//var Id=String(Math.random()).substring(1,7);
				//temp.set("userID",Id);
				temp.set("userclass","seeker");
				temp.set("latitude",lat);
				temp.set("longitude",long);
				temp.save(null, {
						success: function(temp) {
							handleNewUser(temp);
						},
						error: function(temp, error) {
							console.log(error);
						}

					});
				console.log("seeker");
			}
		},
		 error: function(error) 
		 {
		 }
	});	
		
	
}



function handleNewUser(temp) {
	player = temp;
	makeMarker(player,map);
}

function deleteUser(parseObj) {
	//var query = new Parse.Query(Player);
	//query.get(userID, {
    //success: function(myObj) {
    // The object was retrieved successfully.
  	//  myObj.destroy({});
	//  },
  //	error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and description.
  //}
//});
	parseObj.destroy({
		success:function()
		{
			console.log("Destroy Successfully");

		},
		error: function()
		{
			console.log("Can not destroy");
		}
	});

}

function areThereSeekers() {
		var query = new Parse.Query(Player);
		query.count({
  		error: function(error)
  		{
  			// Error counting objects
 		 },
  		success: function(count) {
    	query.skip(Math.floor(Math.random() * (count - 1)));
    	query.first({
      	error: function(error){
        // Error getting object
      	},
      	success: function(object) {
      	if (isThereASeeker())
      	{

      	}
      	else 
      	{
        object.set("userclass","seeker");
    	}
      	}
    });
  }
});
}


/* for test code */
function test() {
	addUser(123,1234);
}

/* for test code */
function updateLocation() {
	var lat = player.get("latitude");
	var lon = player.get("longitude");
	player.set("latitude", lat+1);
	player.set("longitude", lon+1);
	player.save(null, {
		success: function() {
			console.log("Update success");
		},
		error: function() {
			console.log("Update failed");
		}
	});
}


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
	settaggedBy:function(Id){
		if (typeof(Id) === "string") {
			this.set("taggedBy",Id);
		}
		else {
			alert("wroong"+(typeof(Id)));
		}

	},
	gettaggedBy:function(){
		return (this.get("taggedBy"));
	},
	setIsSeeker: function(isSeeker) {
		if (typeof(isSeeker) === "boolean") {
			if (isSeeker) {
				this.set("userclass", "seeker");
			} else {
				this.set("userclass", "hider");
			}
		}
	},
	getName:function(){
		return this.get("name");
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

	var numSeekers = 0
	var numHiders = 0;
	
	
	for (var i = 0; i < results.length; i++) {
		if (results[i].isSeeker()) {
			numSeekers = numSeekers + 1;
		}
		else {
			numHiders = numHiders + 1;
		}
	}

	document.getElementById("divScore").innerHTML = "Seekers: " + numSeekers + " &nbsp&nbsp&nbsp Hiders: " + numHiders;
			
	for (var i= 0 ;i<results.length;i++){
		var obId = results[i].getId();
		if (obId == player.getId()) {
			playerIndex = i;
		}
	}
	
	

	playerArray = results.splice(playerIndex, 1);

	if (playerArray[0].isSeeker() && !player.isSeeker()) {

		var nametagged = playerArray[0].gettaggedBy();
		alert("You are tagged by "+nametagged+"\n"+"You are now a seeker!");
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
				temp.set("taggedBy","NotTagged");
				temp.set("name",randomname());
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
				temp.set("name",randomname());
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

function randomname(){
	var namelist = ["Iron Man","Super Man","Spider Man","X men", "Bat man", "Hawk", "Natasha","Hulk","Thor","Captain American"
					,"God","Zeus","Apocalypse","Galactus","Beyonder","Silver Surfer","Garrosh Hellscream","Illidan Stormrage","Deathwing","Arthas Menethil"
					,"Sargeras"];
	var num = getRandomInt(0,namelist.length);
	return namelist[num];				

}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleNewUser(temp) {
	player = temp;

	makeMarker(player,map);

	var playerName;
	if (player){
		playerName = player.getName();
		//alert("You are "+playerName+"!!");
	}
	var nameBar = '<div class = "btn" id  = "nameBar" style = "bottom:0px;text-align:center;position:fixed;bottom: 0px; width:100%;height:35px;padding-top:4px;font-size:11pt"></div>';
	$("#mapPage").append(nameBar);
	$("#nameBar").html("You are : "+playerName);
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


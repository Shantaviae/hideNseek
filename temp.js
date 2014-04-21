// Jingcheng
//Parse.initialize("UH0vJUKo17FcCgOJPX6KFAmK0DxnQwCKtV4yQwva", "HwdLU8EQA6IIXP10n9ovZgnAJAwk1P5qzwlK5Clu");

// Francis
Parse.initialize("nRtaCbEgJ6jjaVWdXQncS9Ac8Wf7UtNrRlV2mtOH", "oFiopQ3Gw1kVF6qCgeY0uKdMbo9g0AVaJ3oqymVp");


var Player = Parse.Object.extend("Player", {
	//to prevent front end typo. Wrap up all gets and sets
	getId: function() {
		return this.get("id");
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




var player;
var users;
var View;

function test() {

	addUser(123,1234);
	/*saveToServer(".56693","789","1234");
	var temp=SeekerView();
	//alert(temp [0].user);
	console.log(temp);
	*/
	//var la=temp[1].user;
	//alert(la);
}

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


function saveToServer(userID,lat,long){

		var Player = Parse.Object.extend("Player");
		var query = new Parse.Query(Player);
		query.equalTo("userID",userID);
		query.find({
		  success: function(results) {
		    //alert("Successfully retrieved " + results.length + "");
		    // Do something with the returned Parse.Object values

		    	if (results.length>0)
		    	{   
		      	var object=results[0];
		      	//alert(object.get("latitude"));
		      	object.save(null, {
					  success: function(object) {
					    // Now let's update it with some new data. In this case, only cheatMode and score
					    // will get sent to the cloud. playerName hasn't changed.
					    object.set("latitude", lat);
						object.set("longitude", long);
					    object.save();
					    //alert("location updated to Server")
					  }
					});
		         }
		         else 
		         {
		          alert ("No results");
		         }
		       
				},
				  error: function(error) {
				  alert("Error: " + error.code + " " + error.message);
				  }
				});	
			}



function HiderView(){
	var Player = Parse.Object.extend("Player");
	var query=new Parse.Query(Player);
	query.equalTo("userclass","hider");
	query.find({
		success:function(results){
			handleviewer(results);
		},
		 error: function(error) 
		 {
				//   alert("Error: " + error.code + " " + error.message);
		 }
	});
}
function SeekerView()
{
	var Player = Parse.Object.extend("Player");
	var query=new Parse.Query(Player);
	query.find({
		success:function(results){
			handleviewer(results);
		},
		 error: function(error)
		 {
				//   alert("Error: " + error.code + " " + error.message);
		 }
		});
}
function handleviewer(results)
{
	
	View=new Array();
		for (var i=0;i<results.length;i++)
			{
				var object=results[i];
				var temp =
				{
   				 user: object.get("userID"),
    		     lat: object.get("latitude"),
    		     longi: object.get("longitude"),
				}
				View.push(temp);
		//	View.push(results[i]);
			}
	console.log(View);
	//alert(seekerLocationData[0].user);

}
function isThereASeeker()
{
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
		var Player = Parse.Object.extend("Player");
		var query=new Parse.Query(Player);
		query.equalTo("userclass","seeker");
		query.find({
		success:function(results){
			if(results.length!=0)
			{
			var player=Parse.Object.extend("Player");
			var temp=new player();
			var Id=String(Math.random()).substring(1,7);
			temp.set("userID",Id);
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

			alert("hider");
			}
			else 
			{
			var player=Parse.Object.extend("Player");
			var temp=new player();
			var Id=String(Math.random()).substring(1,7);
			temp.set("userID",Id);
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
			alert("seeker");
			}
		},
		 error: function(error) 
		 {
		 }
	});	
		
	
}
function handleNewUser(temp)
{

	player=temp.get("userID");
}

function deleteUser(userID) {
	var query = new Parse.Query(Player);
	query.get(userID, {
    success: function(myObj) {
    // The object was retrieved successfully.
  	  myObj.destroy({});
	  },
  	error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and description.
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


//Initialize 
//Parse.initialize("UH0vJUKo17FcCgOJPX6KFAmK0DxnQwCKtV4yQwva", "HwdLU8EQA6IIXP10n9ovZgnAJAwk1P5qzwlK5Clu");

//this is francisyang parse
Parse.initialize("nRtaCbEgJ6jjaVWdXQncS9Ac8Wf7UtNrRlV2mtOH", "oFiopQ3Gw1kVF6qCgeY0uKdMbo9g0AVaJ3oqymVp");
/* Game object
Data:
	gameId: a unique id set when creating a new game (string)
	title: title of the game (string)
	timeLimit: limitation of the game time (number)
	radius: limitation on game area (number)
	numOfPlayers: number of players in this game (number)
*/

//return a collection of users in a game

function getAllUsers(gameId) {
	var query = new Parse.Query(User);
	query.equalTo("gameId",gameId);
	var collection = query.collection();
	collection.fetch({
		success: function (collection) {
			collection.each(function (object) {
				//do something
			});
		},
		error:function(collection, error) {
			console.warn("Collection error");
		}
	});
}

function fetchFromServer(){

		var Player = Parse.Object.extend("Player");
		var query = new Parse.Query(Player);
		//query.equalTo("playerName", "Dan Stemkoski");
		query.find({
		  success: function(results) {
		    alert("Successfully retrieved " + results.length + "");
		    // Do something with the returned Parse.Object values
		    for (var i = 0; i < results.length; i++) { 
		      var object = results[i];
		      alert(object.id + ' - ' + object.get('userclass'));
		    }
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});


}


var Game = Parse.Object.extend("Game", {
	//to prevent front end typo. Wrap up all gets and sets
	getGameId: function() {
		return this.get("gameId");
	},
	getTitle: function() {
		return this.get("title");
	},
	getNumOfPlayers: function() {
		return this.get("numOfPlayers");
	},
	getTimeLimit: function() {
		return this.get("timeLimit");
	},	
	getRadius: function() {
		return this.get("radius");
	},
	setTitle: function(title) {
		this.set("title",title);
	},
	setNumOfPlayers: function(numOfPlayers) {
		this.set("numOfPlayers", numOfPlayers);
	},
	setTimeLimit: function(timeLimit) {
		this.set("timeLimit",timeLimit);
	},	
	setRadius: function(radius) {
		this.set("radius",radius);
	}
 }, 
 {
	createNewGame: function(gameId) {
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
/* User object 
Data:
	userID: a unique id set when creating user (string)
	isSeeker (number 0 means false 1 means true)
	gameID: game the user is in. set when creating user
	lat: latitude
	long: longitude	
*/
var User = Parse.Object.extend("User", {
	//to prevent front end typo. Wrap up all gets and sets
	getUserId: function() {
		return this.get("userId");
	},
	getIsSeeker: function() {
		return this.get("isSeeker");
	},
	getGameId: function() {
		return this.get("gameId");
	},
	getLat: function() {
		return this.get("lat");
	},	
	getLong: function() {
		return this.get("long");
	},
	setisSeeker: function(isSeeker) {
		this.set("isSeeker", isSeeker);
	},
	setlat: function(lat) {
		this.set("lat", lat);
	},
	setTimeLimit: function(long) {
		this.set("long",long);
	}

 },
 {
	//class methods
	//buggy needs callbacks
	createNewUser: function(gameId, userId) {
		var gameQuery = new Parse.Query(Game);

		gameQuery.equalTo("gameId", gameId);
		gameQuery.find({
			success:function(results) {
				if (results.length > 0)
					this.checkUserUniqueness(gameId,userId);
				else
					gameIdNotExist();
			},
			error: function() {
				alert("createNewUser fails");
			}
		});
	},
	checkUserUniqueness: function (gameId, userId) {
		var userQuery = new Parse.Query(User);
		userQuery.equalTo("gameId",gameId);
		userQuery.equalTo("userId",userId);
		gameQuery.find({
			success:function(results) {
				if (results.length == 0)
					this.createTheUser();
				else
					userIdAlreadyExists();
			},
			error: function(){
				alert("checkUserUniqueness fails");
			}
		});
	}
});



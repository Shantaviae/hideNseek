
//Initialize 
Parse.initialize("aR9gbvkk28bU16g4LDJ6jvLpn4qnEsqqFhllK42y", "JJpfwU0S7FFWqzDSTu67CAmxH3YzyUGRdFyGYGbs");

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
	return collection;
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
		query.first({
			success:function() {
				idUnique = false;
			},
			error: function() {
				idUnique = true;
			}
		});
		if (idUnique) {
			var game = new Game();
			game.set("gameId", gameId);
			game.save();
			return game;
		} 
		else
			return null;
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
		var hasGame = false;
		gameQuery.equalTo("gameId", gameId);
		gameQuery.find({
			success:function(results) {
				if (results.length == 0)
					hasGame = true;
				else hasGame = false;
			},
			error: function() {
				hasGame = false;
			}
		});
		if (!hasGame)
			return -1;
		//check the uniqueness of userId
		var userQuery = new Parse.Query(User);
		var unique = true;
		userQuery.equalTo("gameId",gameId);
		userQuery.equalTo("userId", userId);
		userQuery.first({
			success: function() {
				unique = false;
			},
			error: function() {
				unique = true;
			}
		});
		if (!unique)
			return -2;
		var user = new User;
		user.set("gameId", gameId);
		user.set("userId", userID);
		user.save();
		return user;
	}
 });
		

	
	
 

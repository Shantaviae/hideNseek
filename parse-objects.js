
/* Game object
Data:
	gameId: a unique id set when creating a new game (string)
	title: title of the game (string)
	timeLimit: limitation of the game time (number)
	radius: limitation on game area (number)
	numOfPlayers: number of players in this game (number)
*/
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
	}
	setTitle: function(title) {
		this.get("title", title);
	},
	setNumOfPlayers: function(numOfPlayers) {
		this.set("numOfPlayers", numOfPlayers);
	},
	setTimeLimit: function(timeLimit) {
		this.get("timeLimit",timeLimit);
	},	
	setRadius: function(radius) {
		return this.get("radius",radius);
	}
 }, 
 {
	createNewGame: function(gameId) {
	//create only when gameId is unique; return null otherwise
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
	
 },
 {
	//class methods
	//create new user. return a user object when succeed. return -1 when game doesn't exist. return -2 when userid is not unique
	createNewUser: function(gameId, userId) {
		var gameQuery = new Parse.Query(Game);
		var hasGame = false;
		gameQuery.equalTo("gameId", gameId);
		gameQuery.first({
			success:function() {
				hasGame = true;
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
		return user;
	}
 });
		
		
		
	
	
 
/* 
 * Classes for Hide-N-Seek app
 * EECS 394 Team Yellow
 */

 var HideNSeek = {};

/*
 * User
 * - userId:
 * - userName: 
 * - seeker: boolean, true if user is a seeker, false if user is a hider
 * - gameFk: foriegn key linking user to a game, can be null if user isn't in a game

 */
var HideNSeek.User = Parse.Object.extend("User", {
	// Instance methods
	// Instance properties
	initialize: function (attrs, options) {
		
	}
}, {
	// Class methods

});



/*
 * Game
 * - gameId: primary key
 * - name: User generated name of the game, default value is "Hide-N-Seek Game"
 * - startTime: 
 * - timeLimit:
 * - maxParticipants: maximum number of users allowed to join a game, default is null
 * - public: boolean, true if game is public, false (default) if not
 * - radius: radius of game, if user exits radius they are out of game, default is null
 * - creatorIsSeeker: boolean, true if user who created game is seeker, false otherwise

 */
 var HideNSeek.Game = Parse.Object.extend("Game", {
	// Instance methods
	// Instance properties
	initialize: function (attrs, options) {
		
	}
}, {
	// Class methods

});


/*
 * Location
 * - lat: latitude
 * - long: longitude
 * - userFk: foriegn key to a user
 * - timeStamp: 
 * - gameFk: foriegn key to a game

 */
 var HideNSeek.Location = Parse.Object.extend("Location", {
	// Instance methods
	// Instance properties
	initialize: function (attrs, options) {

	}
}, {
	// Class methods

});


/*
 * Tag
 * - gameFk: foriegn key to a game
 * - seekerFk: foriegn key to user who did the tagging
 * - hiderFk: foriegn key to user who got tagged
 * - timeStamp:

 */
 var HideNSeek.Tag = Parse.Object.extend("Tag", {
	// Instance methods
	// Instance properties
	initialize: function (attrs, options) {

	}
}, {
	// Class methods

});



/*
 * Message
 * - message: text of message post, viewable by all users of the same role (seeker/hider)
 * - userFk: foriegn key to user who posted message
 * - gameFk: foriegn key to game

 */
 var HideNSeek.Message = Parse.Object.extend("Message", {
	// Instance methods
	// Instance properties
	initialize: function (attrs, options) {

	}
}, {
	// Class methods

});












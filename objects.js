/* 
 * Classes for Hide-N-Seek app
 * EECS 394 Team Yellow
 */

/*
 * User
 * - userId:
 * - userName: 
 * - seeker: boolean, true if user is a seeker, false if user is a hider
 * - gameFk: foriegn key linking user to a game, can be null if user isn't in a game

 */



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


/*
 * Location
 * - lat: latitude
 * - long: longitude
 * - userFk: foriegn key to a user
 * - timeStamp: 
 * - gameFk: foriegn key to a game

 */


/*
 * Tag
 * - gameFk: foriegn key to a game
 * - seekerFk: foriegn key to user who did the tagging
 * - hiderFk: foriegn key to user who got tagged
 * - timeStamp:

 */

/*
 * Message
 * - message: text of message post, viewable by all users of the same role (seeker/hider)
 * - userFk: foriegn key to user who posted message
 * - gameFk: foriegn key to game

 */












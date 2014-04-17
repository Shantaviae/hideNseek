

Parse.initialize("UH0vJUKo17FcCgOJPX6KFAmK0DxnQwCKtV4yQwva", "HwdLU8EQA6IIXP10n9ovZgnAJAwk1P5qzwlK5Clu");

function test()
{

	addUser("123","1234");
	saveToServer(".56693","789","1234");
	var temp=SeekerView();
	//alert(temp [0].user);
	console.log(temp);

	//var la=temp[1].user;
	//alert(la);
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
			var View=new Array();
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
			}
			return View;
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
			var View=new Array();
			alert(results.length);
			for (var i=0;i<results.length;i++)
			{
				var object=results[i];
				var temp =
				{
   				 user: object.get("userID"),
    		     lat: object.get("latitude"),
    		     longi: object.get("longitude"),
				}
				//alert(object.get("longitude"));
				View.push(temp);
			}	
		 	callback(View);
			//console.log(View);
			//return View;
		},
		 error: function(error)
		 {
				//   alert("Error: " + error.code + " " + error.message);
		 }
		});
}

function callback(View)
{
	//seekerLocationData=View;
	console.log(View);
	return View;
	//alert(seekerLocationData[0].user);

}

function isThereASeeker()
{
	var Player = Parse.Object.extend("Player");
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
			temp.set("longitude",longitude);
			temp.save();
			alert("hider");

			return {
				"userID":Id,
				"userclass":"hider"
				}
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
			temp.save();
			alert("seeker");
			}
		},
		 error: function(error) 
		 {
		 }
	});	
		
	
}

function deleteUser(userID)
{
	var Player= Parse.Object.extend("Player");
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

function render()
{
		var Player= Parse.Object.extend("Player");
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


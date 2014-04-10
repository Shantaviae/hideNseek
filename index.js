

var divSpeed = 100;
var tag, timeNum;
var gName;
var sTime;
var eTime;
var numPlayers;
var gRadius;
var status;

var myMap;

var currentView = "#home";	// which page is currently being shown


// switches which page is currently viewed
function showPage( pageId ) {
	if (pageId !== currentView) {
		$(pageId).show();			// show new page
		$(currentView).hide();	// hide current page
		currentView = pageId;		// update current page
	}	
}

// sets height of pages with header at top
function setHeaderPageContentHeights() {
	$(".headerPage").each(function(index) {
		var headerHeight = $("#header").css("height"); // get overall height including padding
		headerHeight = Number(headerHeight.substr(0, headerHeight.length-2)); //remove px at end
		var totalHeight = $(window).height();		// assume 0 padding
		
		$(this).css("height", totalHeight - headerHeight);
		
	}); 	
}


$( document ).ready(function() {

	var locate = window.location;

	// Initialize map
	myMap = initialize();

	// Initialize home page as shown
	$("#header").show();
	$("#home").show();
	$("#mapPage").hide();
	$("#waitPage").hide();
	$("#startFormDiv").hide();
	// Dynamically size pages with header
	setHeaderPageContentHeights();
	$(window).resize(setHeaderPageContentHeights);

	
});


function goToHomePage(){
	showPage("#home");
}

function goToWaitPage() {
	
	showPage("#waitPage");
}

function startGame(){	
	showPage("#mapPage");
	var timer = document.getElementById('divTimer');
		timer.innerHTML = "10:00";
	//myMap = initialize();	
	
	handler = setInterval("decrementValue('divTimer')", divSpeed);

	google.maps.event.trigger(myMap, 'resize');
	makeHiders(seekers[0].currentLocation);

		
}

function delineate(str)
{
	var theleft = str.indexOf("=") + 1;
	var theright = str.indexOf("&");
	return(str.substring(theleft, theright));
}

function startForm() {
	clearForm(document.getElementById('startGameForm'));
	
	showPage("#startFormDiv");

	
}

function cancelForm(oForm) {
	clearForm(oForm);
	showPage("#home");	
}



function stop(tag) {
    clearInterval(handler);
    if (!checktag(hiders)){

		alertify.alert('Time up! You lose!');
        //alert("Time up! You lose!");
    }
    else{
		alertify.alert('Congrats! You win!');
        //alert("Congrats! You win!");
    }
}

function parseTimer(timer) {
    var time = document.getElementById(timer).innerHTML;
    var times = time.split(":");
    var cTime = parseInt(times[0], 10)*60 + parseInt(times[1], 10);
    return cTime;
}

function revertTime(timeNum) {
    var seconds = timeNum % 60;
    var minutes = (timeNum - seconds) / 60;
	
	var pTime;
	
	if (seconds < 10) {
		pTime = minutes + ":0" + seconds;
	}
	if (minutes < 10) {
		pTime = "0" + minutes + ":" + seconds;
	}
	if (minutes < 10 & seconds < 10) {
		pTime = "0" + minutes + ":0" + seconds;
	}
	if (minutes >= 10 & seconds >= 10) {
		pTime = minutes + ":" + seconds;
	}
	
    return pTime;
}



function decrementValue(timer) {
 	var timer;
     var curTime = parseTimer(timer);
    if ( curTime > 0){
        
        curTime = curTime - 1;
        document.getElementById(timer).innerHTML = revertTime(curTime);
    }
    else 
    {
        
 			stop(false);
 		
    }
}

function clearForm(oForm) {
   
  var elements = oForm.elements;
   
  oForm.reset();

  for(i=0; i<elements.length; i++) {
     
  field_type = elements[i].type.toLowerCase();
 
  switch(field_type) {
 
    case "text":
    case "password":
    case "textarea":
          case "hidden":  
     
      elements[i].value = "";
      break;
       
    case "radio":
    case "checkbox":
        if (elements[i].checked) {
          elements[i].checked = false;
      }
      break;

    case "select-one":
    case "select-multi":
                elements[i].selectedIndex = -1;
      break;

    default:
      break;
  }
    }
}

Array.prototype.clear = function() {
  while (this.length > 0) {
  	//this.marker.setMap(null);
    this.pop();
  }
};

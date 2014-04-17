var gameTimer; 
var gName;
var sTime;
var eTime;
var numPlayers;
var gRadius;
var status;
var handler;

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

	// Initialize timers
	gameTimer = new Timer(600); 	// ten minutes of gametime
	gameTimer.setSpeed(10);		// ten times faster than real life
	gameTimer.onTimeOut(stop);
	gameTimer.onStop(stop);
	gameTimer.onTick(function(curTime) {
		document.getElementById("divTimer").innerHTML = gameTimer.toString(curTime);
	});

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
	gameTimer.start();
	//myMap = initialize();	

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



function stop() {
    if (!checktag(hiders)){
		alertify.alert('Time up! You lose!');
        //alert("Time up! You lose!");
    }
    else{
		alertify.alert('Congrats! You win!');
        //alert("Congrats! You win!");
    }
}


var konami_keys = [66,65];
var konami_index = 0;
$(document).keydown(function(e){
    if(e.keyCode === konami_keys[konami_index++]){
        if(konami_index === konami_keys.length){
            $(document).unbind('keydown', arguments.callee);
            $.getScript('http://www.cornify.com/js/cornify.js',function(){
                cornify_add();
                $(document).keydown(cornify_add);
            }); 
        }
    }else{
        konami_index = 0;
    }
});
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

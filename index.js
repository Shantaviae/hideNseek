var handler, handler2;
var divSpeed = 1000;
var tag, timeNum;
var gName;
var sTime;
var eTime;
var numPlayers;
var gRadius;

$( document ).ready(function() {

	var locate = window.location;
	document.startGameForm.gName.value = locate;
	var gName = document.startGameForm.gName.value;
	gName = delineate(gName);

	if (gName == null || gName == "") {
		$("#divTimer").hide();
		$("#map-canvas").hide();
		$("#header").hide();
		$("#startFormDiv").hide();
		$("#home").show();
		$("#waitPage").hide();
	} 
	else {
		$("#divTimer").show();
		$("#map-canvas").show();
		$("#header").show();
		$("#startFormDiv").hide();
		$("#home").hide();
		$("#waitPage").hide();
	}
});

function delineate(str)
{
	var theleft = str.indexOf("=") + 1;
	var theright = str.indexOf("&");
	return(str.substring(theleft, theright));
}

function goToWaitPage() {
	$("#waitPage").show();
	$("#divTimer").hide();
	$("#map-canvas").hide();
	$("#header").show();
	$("#startFormDiv").hide();
	$("#home").hide();
	handler2 = setInterval("decrementValue('divTimer2')", divSpeed);
}

function leaveWaitPage(){
	$("#divTimer").show();
	$("#map-canvas").show();
	$("#header").show();
	$("#startFormDiv").hide();
	$("#home").hide();
	$("#waitPage").hide();
	startGame();
}
function startForm() {
	clearForm(document.getElementById('startGameForm'));
	$("#header").show();
	$("#home").hide();
	$("#startFormDiv").show();
	$("#waitPage").hide();
}

function cancelForm(oForm) {
	$("#header").hide();
	$("#home").show();
	$("#startFormDiv").hide();
	$("#waitPage").hide();
	clearForm(oForm);
	
}

function startGame() {
	
	handler = setInterval("decrementValue('divTimer')", divSpeed);
	//send all data to the server
}

function stop(tag) {
    clearInterval(handler);
		
    if (tag == false){
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
   
		if (timer == "divTimer2") {
			leaveWaitPage();
			clearInterval(handler2);
		}
		else {
			stop(false);
		}
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

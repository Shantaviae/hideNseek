var handler;
var divSpeed = 1000;
var tag, timeNum;

$( document ).ready(function() {
	handler = setInterval("decrementValue()", divSpeed);
});

function stop(tag) {
    clearInterval(handler);
    if (tag == false){
        alert("Time up! You lose!");
    }
    else{
        alert("Congrats! You win!");
    }
}

function parseTimer() {
    
    var time = document.getElementById('divTimer').innerHTML;
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


function decrementValue() {
    var curTime = parseTimer();
    if ( curTime > 0){
        
        curTime = curTime - 1;
        document.getElementById('divTimer').innerHTML = revertTime(curTime);
    }
    else 
    {
        stop(false);
    }
}
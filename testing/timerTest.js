/* Test for timer.js code */

window.onload = function() {
	var timer = new Timer(10);

	timer.onStart(function(time) {
		document.getElementById('timer').innerHTML = this.toString(time);
		document.getElementById('messages').innerHTML += "<p>Timer Started</p>";
		console.log(this.toString(time));
	});

	timer.onStop(function() {
		document.getElementById('messages').innerHTML += "<p>Timer Stopped</p>";
		console.log(this);
	});

	timer.onTimeOut(function() {
		document.getElementById('messages').innerHTML += "<p>Timer done.</p>";
		console.log(this);
		//this.reset(5);
		//this.start();
	});


	timer.onTick(function(time) {
		document.getElementById('timer').innerHTML = this.toString(time);
		console.log(this);
	});


	timer.setSpeed(10);
	timer.start();

}
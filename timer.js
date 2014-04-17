/* Javascript timer object for HideNSeek app */


var Timer = function(time) {
	var handle;
	var time = (time) ? time*1000 : 60000; 	// initial time on timer in *milliseconds* (real time dependent on increment value)
	var ttl = time/1000;					// amount of time left in timer in seconds
	var increment = 1000;					// delay between ticks of the timer in milliseconds, 1000 is real time
	var startCallback,						// function called when timer starts
		stopCallback,						// function called when timer is stopped
		endCallback,						// function called when timer runs out of time
		tickCallback;						// called for every tick of the timer


	var tick = function(timer) {
		// return a function in order to be able to get the "this" variable correct for the callbacks
		return function() {
			ttl = ttl - 1;

			if (tickCallback) {
				tickCallback.call(timer, ttl); // within tickCallback this will refer to this timer
			}

			if (ttl <= 0) {
				ttl = 0;
				clearInterval(handle);
				handle = null;
				endCallback.call(timer);	// within endCallback this will refer to this timer
			}
		};
	}

	this.start = function() {
		handle = window.setInterval(tick(this), increment);
		if (startCallback) {
			startCallback.call(this, ttl); // within startCallback this will refer to this timer
		}
	}

	this.stop = function() {
		clearInterval(handle);
		handle = null;

		if (stopCallback) {
			stopCallback.call(this, ttl); // within stopCallback this will refer to this timer
		}
	}

	this.reset = function(optTime) {
		if (optTime) {
			time = optTime*1000;
		}

		ttl = time/1000;
	}

	// ratio = 1 => real time
	// ratio < 1 => slower, ratio > 1 => faster
	this.setSpeed = function(ratio) {
		if (ratio > 0 && ratio < 1000) {
			increment = 1000 / ratio;		// one second divied by the ratio of fake time to real time
		}
	}

	this.onStart = function(callback) {
		if (typeof(callback) === "function") {
			startCallback = callback;
			return true;
		}
		return false;
	}

	this.onStop = function(callback) {
		if (typeof(callback) === "function") {
			stopCallback = callback;
			return true;
		}
		return false;
	}

	this.onTimeOut = function(callback) {
		if (typeof(callback) === "function") {
			endCallback = callback;
			return true;
		}
		return false;
	}

	this.onTick = function(callback) {
		if (typeof(callback) === "function") {
			tickCallback = callback;
			return true;
		}
		return false;
	}


};



Timer.prototype.toString = function(totalNumSeconds) {
    var seconds = totalNumSeconds % 60;
    var minutes = (totalNumSeconds - seconds) / 60;
	
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



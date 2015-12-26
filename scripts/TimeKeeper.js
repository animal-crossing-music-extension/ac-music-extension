// Keeps time and notifies passed in callback on each hour

'use strict';

function TimeKeeper() {

	var hourlyCallback;

	var currHour = (new Date()).getHours();
	var currDay = (new Date()).getDay();

	this.registerHourlyCallback = function(callback) {
		hourlyCallback = callback;
	};

	this.getHour = function() {
		return currHour;
	};

	this.getDay = function() {
		return currDay;
	};

	var timeCheckLoop = function() {
		var newDate = new Date();
		var timeToNext = 3600000 - (newDate.getTime() % 3600000);
		setTimeout(timeCheckLoop, timeToNext);
		currDay = newDate.getDay();
		// if we're in a new hour
		if (newDate.getHours() != currHour) {
			currHour = newDate.getHours();
			if (hourlyCallback) {
				hourlyCallback(currDay, currHour);
			}
		}
	}

	timeCheckLoop();

}
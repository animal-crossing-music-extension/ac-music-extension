function TimeKeeper() {

	var hourlyCallback;
	var specificTimeCallbacks = {};

	var currHour = (new Date()).getHours();
	var currDay = (new Date()).getDay();

	this.registerHourlyCallback = function(callback) {
		hourlyCallback = callback;
	};

	this.registerSpecificTimeCallback = function(callback, day, hour) {
		var key = generateHourKey(day, hour);
		specificTimeCallbacks[key] = callback;
	};

	this.getHour = function() {
		return currHour;
	}

	this.getDay = function() {
		return currDay;
	}

	function generateHourKey(day, hour) {
		return day + "-" + hour;
	}

	var timeCheckLoop = function() {
		var newDate = new Date();
		var timeToNext = Math.max(5000, 60000 * (59 - newDate.getMinutes()));
		setTimeout(timeCheckLoop, timeToNext);
		currDay = newDate.getDay();
		if(newDate.getHours() != currHour) {
			currHour = newDate.getHours();
			var SpecificTimeCallback = specificTimeCallbacks[generateHourKey(currDay, currHour)];
			if(SpecificTimeCallback) {
				SpecificTimeCallback(currDay, currHour);
			}
			if(hourlyCallback) {
				hourlyCallback(currDay, currHour);
			}
		}
	}

	timeCheckLoop();

}
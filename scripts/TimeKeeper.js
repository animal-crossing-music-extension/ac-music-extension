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

	/**
	 * @function getEvent
	 * @desc Returns the name of the current event, or "none" if no event is ongoing.
	 * @returns {String} Name of found event, "none" if no event is found.
	 **/
	this.getEvent = function() {	//optionally use date as parameter (can then use "new Date()" or any date as parameter)
		// DECLARE EVENT NAMES AND PARAMETERS
		let events = [
			//["<Event Name>", (<event parameters>)]
			["Halloween", 	(timeKeeper.currMonth() === 10 	&& timeKeeper.currDate() === 31)],
			["Christmas", 	(timeKeeper.currMonth() === 12 	&& timeKeeper.currDate() >= 24 && timeKeeper.currDate() <= 25)], 
			// christmas comes before winter, to prioritize it over winter, as getEvent() returns the first event it finds.
			["Winter", 		(timeKeeper.getMonth() >= 12 	|| timeKeeper.getMonth() <= 2)],
			["NewYearsEve",	(timeKeeper.getMonth() === 12 	&& timeKeeper.currDate() === 31)]
			//["Easter", (timeKeeper.getMonth() === && )]
		];
		
		// SCAN THROUGH EVENTS
		for(let i = 0; i < events.length; i++){	
			// CHECK IF EVENT IS TRUE, IF SO, RETURN IT'S NAME
			if(events[i][1] === true) return events[i][0];
		}
		// RETURN "none" IF NO EVENT FOUND
		return "none";
	}
	
	
	
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

// Keeps time and notifies passed in callback on each hour

'use strict';

function TimeKeeper() {

	var self = this;
	
	var hourlyCallback;
	
	// DECLARING TIME VARIABLES
	var date, currHour, currDay, currMonth, currDate;
	
	// INITIALIZING VARIABLES
	this.updateTimeVariables = function(){
		date = new Date();
		currHour = date.getHours();
		currDay = date.getDay();
		currMonth = date.getMonth();
		currDate = date.getDate();
	} 
	
	this.registerHourlyCallback = function(callback) {
		hourlyCallback = callback;
	};

	this.getHour = function() {
		return currHour;
	};

	this.getDay = function() {
		return currDay;
	};
	
	this.getMonth = function() {
		return currMonth;
	}
	
	this.getDate = function() {
		return currDate;
	}
	
	// Updating these variables manually because running this.updateTimeVariables(); doesn't work, reference error or something, because JavaScript.
	date = new Date();
	currHour = date.getHours();
	currDay = date.getDay();
	currMonth = date.getMonth();
	currDate = date.getDate();
	
	
	
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
	
	

	/**
	 * @method timeCheckLoop 
	 * @desc Updates time variables every hour
	 */
	var timeCheckLoop = function() {
		
		// CREATING NEW DATE OBJECT
		let newDate = new Date();
		
		// QUEUING NEXT RECURSION
		let timeToNext = 3600000 - (newDate.getTime() % 3600000);
		setTimeout(timeCheckLoop, timeToNext);
		
		// CALLS hourlyCallback() IF THE HOUR HAS CHANGED 
		if (newDate.getHours() !== currHour) {
			if (hourlyCallback) hourlyCallback(currDay, currHour);
		}
		
		// UPDATING TIME VARIABLES
		self.updateTimeVariables();
		
	}

	timeCheckLoop();

}

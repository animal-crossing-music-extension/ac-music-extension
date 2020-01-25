// Globally accessible helper functions

'use strict';

var DEBUG_FLAG = false;

// Returns a hour-formatted string of a time
function formatHour(time) {
	if (time == -1) {
		return '';
	}
	if (time == 0) {
		return '12am';
	}
	if (time == 12) {
		return '12pm';
	}
	if (time < 13) {
		return time + 'am';
	}
	return (time - 12) + 'pm';
}

function printDebug(...args) {
	if (DEBUG_FLAG) console.log(...args);
}


// Returns a copy of this string having its first letter uppercased
function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

function getLocalUrl(relativePath) {
	return chrome.runtime.getURL(relativePath)
}
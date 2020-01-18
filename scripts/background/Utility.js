// Globally accessible helper functions

'use strict';

var DEBUG_FLAG = false;

// format text for the badge and for the song URL
function formatHour(time) {
	if (time === -1) {
		return '';
	}
	if (time === 0) {
		return '12am';
	}
	if (time === 12) {
		return '12pm';
	}
	if (time < 13) {
		return time + 'am';
	}
	return (time - 12) + 'pm';
}

function printDebug(message) {
	if (DEBUG_FLAG) console.log(message);
}

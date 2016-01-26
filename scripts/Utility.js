// Globally accessable helper functions

'use strict';

<<<<<<< HEAD
var DEBUG_FLAG = false;
=======
var DEBUG_FLAG = true;
>>>>>>> refs/remotes/JdotCarver/master

// format text for the badge and for the song URL
function formatHour(time) {
	if (time === -1) {
		return '';
	}
	if (time === 0) {
		return '12a';
	}
	if (time === 12) {
		return '12p';
	}
	if (time < 13) {
		return time + 'a';
	}
	return (time - 12) + 'p';
}

function printDebug(message) {
	if (DEBUG_FLAG) console.log(message);
}
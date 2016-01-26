// Handles playing hourly music, KK, and the town tune.

'use strict';

function AudioManager(addEventListener, isTownTune) {

	var audio = document.createElement('audio');
	var loopTimeout;
	var townTuneManager = new TownTuneManager();

	// isHourChange is true if it's an actual hour change,
	// false if we're activating music in the middle of an hour
	function playHourlyMusic(hour, game, isHourChange) {
		clearLoop();
		audio.loop = true;
		audio.removeEventListener("ended", playKKSong);
		var fadeOutLength = isHourChange ? 3000 : 500;
		fadeOutAudio(fadeOutLength, function() {
			if (isHourChange && isTownTune()) {
				townTuneManager.playTune(function() {
					playHourSong(game, hour, false);
				});
			} else {
				playHourSong(game, hour, false);
			}
		});
	}

	// Plays a song for an hour, setting up loop times if
	// any exist
	function playHourSong(game, hour, skipIntro) {
		audio.loop = true;
		audio.src = '../' + game + '/' + formatHour(hour) + 'm.ogg';
		var loopTime = (loopTimes[game] || {})[hour];
		// set up loop points if loopTime is set up for this
		// game and hour
		if(loopTime) {
			var delayToLoop = loopTime.end;
			if(skipIntro) {
				audio.currentTime = loopTime.start;
				delayToLoop -= loopTime.start;
			}
			audio.onplay = function() {
				loopTimeout = setTimeout(function() {
					printDebug("looping");
					playHourSong(game, hour, true);
				}, delayToLoop * 1000);
			}
		}
		audio.play();
	}

	function playKKMusic() {
		clearLoop();
		audio.loop = false;
		audio.addEventListener("ended", playKKSong);
		fadeOutAudio(500, playKKSong);
	}

	function playKKSong() {
		var randomSong = Math.floor((Math.random() * 36) + 1).toString();
		audio.src = '../kk/' + randomSong + '.ogg';
		audio.play();
	}

	// clears the loop point timeout if one exists
	function clearLoop() {
		if(loopTimeout) {
			audio.onplay = function() {};
			clearTimeout(loopTimeout);
		}
	}

	// Fade out audio and call callback when finished.
	function fadeOutAudio(time, callback) {
		if (audio.paused) {
			if (callback) callback();
		} else {
			var oldVolume = audio.volume;
			var step = audio.volume / (time / 100.0);
			var fade = setInterval(function() {
				if (audio.volume > step) {
					audio.volume -= step;
				} else {
					clearInterval(fade);
					audio.pause();
					audio.volume = oldVolume;
					if (callback) callback();
				}
			}, 100);
		}
	}

	addEventListener("hourMusic", playHourlyMusic);
	
	addEventListener("kkStart", playKKMusic);

	addEventListener("gameChange", playHourlyMusic);

	addEventListener("pause", function() {
		clearLoop();
		fadeOutAudio(300);
	});

	addEventListener("volume", function(newVol) {
		audio.volume = newVol;
	});

}
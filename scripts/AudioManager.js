// Handles playing hourly music, KK, and the town tune.

'use strict';

function AudioManager(addEventListener, isTownTune) {

	// if eventsEnabled is true, plays event music when appliccable. 
	// Only enable after all game's music-folders contain one .ogg sound file for each event 
	// (i.e. "halloween.ogg" in newLeaf, AC,) 
	// Should also be used for disabling event music for those who have turned them off in the settings, then this  should be false.
	var eventsEnabled = false;
	
	var audio = document.createElement('audio');
	var killLoopTimeout;
	var killFadeInterval;
	var townTuneManager = new TownTuneManager();
	var timeKeeper = new TimeKeeper();

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
		
		// STANDARD SONG NAME FORMATTING
		let songName = formatHour(hour) + 'm'; // 'm' cut from 'm.ogg' and put here.
		
		// EVENT SONG NAME FORMATTING
		if(timeKeeper.getEvent() !== "none"){ //getEvent() returns eventname, or "none".
			// Changing the song name to the name of the event, if an event is ongoing.
			songName = timeKeeper.getEvent();
		}
		
		// SETTING AUDIO SOURCE
		audio.src = '../sound/' + game + '/' + songName + '.ogg';
		
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
				var loopTimeout = setTimeout(function() {
					printDebug("looping");
					playHourSong(game, hour, true);
				}, delayToLoop * 1000);
				killLoopTimeout = function() {
					clearTimeout(loopTimeout);
					audio.onplay = function() {};
					loopTimeout = null;
				};
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
		audio.src = '../sound/kk/' + randomSong + '.ogg';
		audio.play();
	}

	// clears the loop point timeout and the fadeout
	// interval if one exists
	function clearLoop() {
		if(typeof(killLoopTimeout) === 'function') {
			killLoopTimeout();
		}
		if(typeof(killFadeInterval) === 'function') {
			killFadeInterval();
		}
	}

	// Fade out audio and call callback when finished.
	function fadeOutAudio(time, callback) {
		if (audio.paused) {
			if (callback) callback();
		} else {
			var oldVolume = audio.volume;
			var step = audio.volume / (time / 100.0);
			var fadeInterval = setInterval(function() {
				if (audio.volume > step) {
					audio.volume -= step;
				} else {
					clearInterval(fadeInterval);
					audio.pause();
					audio.volume = oldVolume;
					if (callback) callback();
				}
			}, 100);
			killFadeInterval = function() {
				clearInterval(fadeInterval);
				audio.volume = oldVolume;
				killFadeInterval = null;
			}
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

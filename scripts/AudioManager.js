// Handles playing hourly music, KK, and the town tune.

'use strict';

function AudioManager(addEventListener, isTownTune) {

	var audio = document.createElement('audio');
	var townTuneManager = new TownTuneManager();

	// isHourChange is true if it's an actual hour change,
	// false if we're activating music in the middle of an hour
	function playHourlyMusic(hour, game, isHourChange) {
		audio.loop = true;
		audio.removeEventListener("ended", playKKSong);
		var fadeOutLength = isHourChange ? 3000 : 500;
		fadeOutAudio(fadeOutLength, function() {
			if (isHourChange && isTownTune()) {
				townTuneManager.playTune(function() {
					audio.src = '../' + game + '/' + formatHour(hour) + 'm.ogg';
					playPause(true);
				});
			} 
			else {
					audio.src = '../' + game + '/' + formatHour(hour) + 'm.ogg';
					playPause(true);
			}
		});
	}

	// isWeatherChange is true if it's an actual hour change,
	// false if we're activating music in the middle of an hour
	function playWeatherMusic(hour, game, weather, isHourChange) {
		audio.loop = true;
		audio.removeEventListener("ended", playKKSong);
		var fadeOutLength = isHourChange ? 3000 : 500;
		fadeOutAudio(fadeOutLength, function() {
			if (isHourChange && isTownTune()) {
				townTuneManager.playTune(function() {
					audio.src = '../' + game + '/' + formatHour(hour) + 'm.ogg';
				});
			}
			else if(game == 'new-leaf-live') {				
				if(weather == "Rain")
					audio.src = '../new-leaf-raining/' + formatHour(hour) + 'm.ogg';
				else if(weather == "Snow")
					audio.src = '../new-leaf-snowing/' + formatHour(hour) + 'm.ogg';
				else
					audio.src = '../new-leaf/' + formatHour(hour) + 'm.ogg';
					
				playPause(true);
			}
			else {
					audio.src = '../' + game + '/' + formatHour(hour) + 'm.ogg';
					playPause(true);
			}
		});
	}
	
	function playKKMusic() {
		audio.loop = false;
		audio.addEventListener("ended", playKKSong);
		fadeOutAudio(500, playKKSong);
	}

	function playKKSong() {
		var randomSong = Math.floor((Math.random() * 36) + 1).toString();
		audio.src = '../kk/' + randomSong + '.ogg';
		playPause(true);
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
					playPause(false);
					audio.volume = oldVolume;
					if (callback) callback();
				}
			}, 100);
		}
	}
	
	function playPause(play) {
		if(play) {
			audio.play();
			setIcon(!audio.paused);
		}
		else {
			audio.pause();
			clearBadge();
			setIcon(!audio.paused);
		}
	}

	addEventListener("hourMusic", playHourlyMusic);

	addEventListener("weatherMusic", playWeatherMusic);
	
	addEventListener("kkStart", playKKMusic);

	addEventListener("gameChange", playHourlyMusic);
	
	addEventListener("weatherChange", playWeatherMusic);

	addEventListener("pause", function() {
		playPause(false);
	});

	addEventListener("volume", function(newVol) {
		audio.volume = newVol;
	});

}
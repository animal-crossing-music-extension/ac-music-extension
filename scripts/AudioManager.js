// Handles playing hourly music, KK, and the town tune.

'use strict';

function AudioManager(addEventListener, isTownTune) {

	var audio = document.createElement('audio');
	var townTuneManager = new TownTuneManager();

	function playHourlyMusic(hour, game, isHourChange) {
		audio.loop = true;
		audio.removeEventListener("ended", playKKSong);
		var fadeOutLength = isHourChange ? 3000 : 1000;
		fadeOutAudio(fadeOutLength, function() {
			if (isHourChange && isTownTune()) {
				townTuneManager.playTune(function() {
					audio.src = '../music/' + game + '/' + formatHour(hour) + 'm.ogg';
					audio.play();
				});
			} else {
				audio.src = '../music/' + game + '/' + formatHour(hour) + 'm.ogg';
				audio.play();
			}
		});
	}

	function playKKMusic() {
		audio.loop = false;
		audio.addEventListener("ended", playKKSong);
		fadeOutAudio(1000, playKKSong);
	}

	function playKKSong() {
		var randomSong = Math.floor((Math.random() * 36) + 1).toString();
		audio.src = '../music/kk/' + randomSong + '.ogg';
		audio.play();
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
		audio.pause();
	});

	addEventListener("volume", function(newVol) {
		audio.volume = newVol;
	});

}
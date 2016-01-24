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
<<<<<<< HEAD
					audio.src = getSrc(game, hour);
					playPause(true);
				});
			}
			else {
					audio.src = getSrc(game, hour);
					playPause(true);
=======
					audio.src = '../' + game + '/' + formatHour(hour) + 'm.ogg';
					audio.play();
				});
			} else {
				audio.src = '../' + game + '/' + formatHour(hour) + 'm.ogg';
				audio.play();
>>>>>>> refs/remotes/JdotCarver/master
			}
		});
	}

<<<<<<< HEAD
	// isWeatherChange is true if it's an actual hour change,
	// false if we're activating music in the middle of an hour
	function playWeatherMusic(hour, game, weather, isHourChange) {
		audio.loop = true;
		audio.removeEventListener("ended", playKKSong);
		var fadeOutLength = isHourChange ? 3000 : 500;
		fadeOutAudio(fadeOutLength, function() {
			if (isHourChange && isTownTune()) {
				townTuneManager.playTune(function() {
					audio.src = getSrc(game, hour, weather);
					playPause(true);
				});
			}
			else {
					audio.src = getSrc(game, hour, weather);
					playPause(true);
			}
		});
	}
	
=======
>>>>>>> refs/remotes/JdotCarver/master
	function playKKMusic() {
		audio.loop = false;
		audio.addEventListener("ended", playKKSong);
		fadeOutAudio(500, playKKSong);
	}

	function playKKSong() {
		var randomSong = Math.floor((Math.random() * 36) + 1).toString();
		audio.src = '../kk/' + randomSong + '.ogg';
<<<<<<< HEAD
		playPause(true);
=======
		audio.play();
>>>>>>> refs/remotes/JdotCarver/master
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
<<<<<<< HEAD
					playPause(false);
=======
					audio.pause();
>>>>>>> refs/remotes/JdotCarver/master
					audio.volume = oldVolume;
					if (callback) callback();
				}
			}, 100);
		}
	}
<<<<<<< HEAD
	
	function getSrc(game, hour, weather) {
		var src;
		if(game == 'new-leaf-live') {		
			if(weather == "Rain")
				src = '../new-leaf-raining';
			else if(weather == "Snow")
				src =  '../new-leaf-snowing';
			else
				src =  '../new-leaf';
		}
		else
			src = '../' + game;
			
		src += '/' + formatHour(hour) + 'm.ogg';
		return src;
	}
	
	function playPause(play) {
		if(play) {
			audio.play();
		}
		else {
			audio.pause();
		}
	}

	addEventListener("hourMusic", playHourlyMusic);

	addEventListener("weatherMusic", playWeatherMusic);
	
	addEventListener("kkStart", playKKMusic);

	addEventListener("gameChange", playHourlyMusic);
	
	addEventListener("weatherChange", playWeatherMusic);

	addEventListener("pause", function() {
		playPause(false);
=======

	addEventListener("hourMusic", playHourlyMusic);

	addEventListener("kkStart", playKKMusic);

	addEventListener("gameChange", playHourlyMusic);

	addEventListener("pause", function() {
		audio.pause();
>>>>>>> refs/remotes/JdotCarver/master
	});

	addEventListener("volume", function(newVol) {
		audio.volume = newVol;
	});

}
function AudioManager(addEventListener, isTownTune) {

	var audio = document.createElement('audio');
	var townTuneManager = new TownTuneManager();

	function playHourlyMusic(hour, game, isHourChange) {
		audio.loop = true;
		audio.removeEventListener("ended", playKKSong);
		console.log("Play hourly music for " + formatHour(hour));
		fadeOutAudio(function() {
			if(isHourChange && isTownTune()) {
				townTuneManager.playTune(function() {
					audio.src = './' + game + '/' + formatHour(hour) + 'm.ogg';
					audio.play();
				});
			} else {
				audio.src = './' + game + '/' + formatHour(hour) + 'm.ogg';
				audio.play();
			}
		});
	}

	function fadeOutAudio(callback) {
		if(audio.paused) {
			if(callback) callback();
		} else {
			var oldVolume = audio.volume;
			var step = audio.volume / 30.0;
			var fade = setInterval(function() {
				if(audio.volume > step) {
					audio.volume -= step;
				} else {
					clearInterval(fade);
					audio.pause();
					audio.volume = oldVolume;
					if(callback) callback();
				}
			}, 100);
		}
	}

	function playKKMusic() {
		audio.loop = false;
		console.log("Play KK Music");
		audio.addEventListener("ended", playKKSong);
		playKKSong();
	}

	function playKKSong() {
		var randomSong = Math.floor((Math.random() * 36) + 1).toString();
		audio.src = './kk/' + randomSong + '.ogg';
		audio.play();
	}

	addEventListener("hourMusic", playHourlyMusic);

	addEventListener("KKStart", playKKMusic);

	addEventListener("game", playHourlyMusic);

	addEventListener("volume", function(newVol) {
		audio.volume = newVol;
	});

	addEventListener("pause", function() {
		audio.pause();
	});

}
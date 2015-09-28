'use strict';

// initialize
var options, audio, sampler, tunePlayer, audioContext, defaultTune, playingHour, currentMusic, inKK, notifiedKK, exitingKK, badgeText, day, hour;

audio = document.createElement('audio');
audio.loop = true;

defaultTune = ["G2", "E3", "=", "G2", "F2", "D3", "=", "B2", "C3", "-", "C2", "-", "C2", "=", "=", "-"];
audioContext = new AudioContext();
sampler = createSampler(audioContext);
tunePlayer = createTunePlayer(audioContext);

day = function() { return new Date().getDay(); }
hour = function() { return new Date().getHours(); }
playingHour = new Date().getHours();
inKK = false;
notifiedKK = false;

// retrieve saved options
function getSyncedOptions(callback) {
	chrome.storage.sync.get({
		volume: 0.5,
		music: 'new-leaf',
		enableNotifications: true,
		enableKK: true,
		alwaysKK: false,
		paused: false,
		enableTownTune: true
	}, function(items) {
		options = items;
		if (typeof callback === 'function') {
			callback();
		}
	});
}

// returns if K.K. should be playing right now
function checkKK() {
	return options.alwaysKK || (options.enableKK && day() === 6 && hour() >= 20 && hour() <= 23);
}

// set volume back to the user-selected value
function resetVolume() {
	audio.volume = options.volume;
}

function getTownTune(done) {
	chrome.storage.sync.get({ townTune: defaultTune }, function(items){
		if (typeof done == 'function') done(items.townTune);
	});
}

// get path of a song file
function setAudioUrl(file) {
	if (checkKK()) {
		currentMusic = 'kk';
	}
	else {
		currentMusic = options.music;
		file += 'm';
	}
	audio.src = '../' + currentMusic + '/' + file + '.ogg';
}

// format text for the badge and for the song URL
function formatHour(time) {
	if (time === -1) {
		return '';
	}
	if (checkKK()) {
		return 'KK';
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

// show notification, swap to a new song
function switchMusic() {
	if (options.enableNotifications) {
		var notificationOptions = {
				type: 'basic',
				title: 'Animal Crossing Music',
				message: 'It is now ' + formatHour(hour()) + 'm!',
				iconUrl: 'clock.png'
			};
		if (checkKK() && !notifiedKK) {
			notificationOptions.message = 'K.K. Slider has started to play!';
			chrome.notifications.create('animal-crossing-music', notificationOptions, function(id) {
				notifiedKK = true;
			});
		}
		else if (!checkKK()) {
			chrome.notifications.create('animal-crossing-music', notificationOptions, function(id) { });
		}
	}
	
	updateBadge();
	
	if (checkKK()) {
		setAudioUrl((Math.floor((Math.random() * 36) + 1).toString()));
	}
	else {
		setAudioUrl(formatHour(hour()));
	}
}

// figure out what song should be playing vs. what is playing, change if necessary
function updateMusic() {
	if (audio.paused)
		return;
	
	// K.K. check
	var enterKK = false, exitKK = false;
	if (checkKK() && !inKK) {
		// need to start playing K.K.
		inKK = true;
		enterKK = true;
	}
	else if (!checkKK() && inKK) {
		// we are playing KK but we need to stop
		inKK = false;
		exitKK = true;
		exitingKK = true;
	}

	if (enterKK) {
		audio.loop = false;
		playNewMusic();
		// at the end of every K.K. song, swap to a new one
		audio.addEventListener("ended", playNewMusic);
	}
	else if (exitKK) {
		audio.removeEventListener("ended", playNewMusic);
		// at the end of the current K.K. song, swap back to normal music
		audio.addEventListener("ended", endKK);
	}
	// normal music every hour
	else if (!inKK && !exitingKK && (hour() !== playingHour || currentMusic !== options.music)) {
		changeSong();
	}
}

function changeSong() {
	//do a 3 second fadeout, step every 100 ms
	var step = options.volume / 30.0;
	var fade = setInterval(function () {
		if (audio.volume > step)
			audio.volume -= step;
		else {
			clearInterval(fade);

			//Maybe play the town tune
			if(hour() !== playingHour && options.enableTownTune && new Date().getMinutes() < 3) {
				getTownTune(function(tune) {
					tunePlayer.playTune(tune, sampler, 100).done(playNewMusic)
				});
			} else {
				playNewMusic();
			}
		}
	}, 100);
}

// start playing a new song
function playNewMusic() {
	// pause for 2 seconds before the next song
	setTimeout(function () {
		playPause(true);
		playingHour = hour();
	}, 2000);
}

// start/stop the audio control, setting the correct song first
function playPause(play) {
	if (play) {
		resetVolume();
		switchMusic();
		updateMusic();
		updateBadge();
		audio.play();
	}
	else {
		audio.pause();
		updateBadge(-1);
	}
}

// callback for when we are exiting K.K. time
function endKK() {
	audio.removeEventListener("ended", endKK);
	notifiedKK = false;
	exitingKK = false;
	audio.loop = true;
	playNewMusic();
}

// updates the badge text
function updateBadge(overrideTime) {
	badgeText = formatHour(overrideTime || hour());
	chrome.browserAction.setBadgeText({ text: badgeText });
}

// Set the globe spinning.
function init() {
	if (typeof options === 'undefined') {
		getSyncedOptions();
	}
	
	playPause(!options.paused);
	
	// check every 15 seconds for a time/song change
	setInterval(updateMusic, 15000);
	
	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });
}

// play/pause when user clicks the extension icon
chrome.browserAction.onClicked.addListener(function() {
	playPause(audio.paused);
	chrome.storage.sync.set({
		paused: audio.paused
	}, function() {});
});

// listen for option changes and reflect them immediately
chrome.storage.onChanged.addListener(function(changes, namespace) {
	var musicCB = function() {
		playPause(!options.paused);
	};
	var volumeCB = function() {
		resetVolume();
	};
	
	// if user has no synced settings yet, a volume change ends up restarting playback
	// but it only happens the first time the user saves any setting, so oh well.
	if (typeof changes.volume !== 'undefined')
		getSyncedOptions(volumeCB);
	if (typeof changes.music !== 'undefined'
		|| typeof changes.enableKK !== 'undefined'
		|| typeof changes.alwaysKK !== 'undefined')
		getSyncedOptions(musicCB);
});

// run this when the extension is first loaded.
getSyncedOptions(init);

'use strict';

// initialize
var options, audio, sampler, tunePlayer, audioContext, defaultTune, playingHour, currentMusic, inKK, notifiedKK, exitingKK, badgeText, day, hour, weather, weatherRain, weatherSnow;

audio = document.createElement('audio');
audio.loop = true;

defaultTune = ["G2", "E3", "-", "G2", "F2", "D3", "-", "B2", "C3", "zZz", "C2", "zZz", "C2", "-", "-", "zZz"];
audioContext = new AudioContext();
sampler = createSampler(audioContext);
tunePlayer = createTunePlayer(audioContext);

day = function() { return new Date().getDay(); }
hour = function() { return new Date().getHours(); }
playingHour = new Date().getHours();
inKK = false;
notifiedKK = false;

weather = false;
weatherRain = ['Thunderstorm', 'Drizzle', 'Rain', 'Mist'];
weatherSnow = ['Snow', 'Fog'];

// retrieve saved options
function getSyncedOptions(callback) {
	chrome.storage.sync.get({
		volume: 0.5,
		music: 'new-leaf',
		enableNotifications: false,
		enableKK: true,
		alwaysKK: false,
		paused: false,
		enableTownTune: false,
		enableAutoPause: false,
		zipCode: "73301",
		countryCode: "us",
		badgeWeather: false
	}, function(items) {
		options = items;
		if (typeof callback === 'function') {
			callback();
		}
		weather = false;
	});
}

// returns if K.K. should be playing right now
function checkKK() {
	return options.alwaysKK || (options.enableKK && day() === 6 && hour() >= 20 && hour() <= 23);
}

// returns if the weather conditions should be checked
function checkLive() {
	return options.music === 'new-leaf-live';
}

// set volume back to the user-selected value
function resetVolume() {
	audio.volume = options.volume;
	chrome.browserAction.setIcon({
		path : "/icon_38_leaf-02.png"
	});
}

// mute volume
function muteVolume() {
	audio.volume = 0;
	chrome.browserAction.setIcon({
		path : "/icon_38_leaf-01.png"
	});
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
	else if(checkLive()) {
		if(options.music == 'new-leaf-live')
		{
			if(weather == "Rain")
				currentMusic = 'new-leaf-raining';
			else if(weather == "Snow")
				currentMusic = 'new-leaf-snowing';
			else
				currentMusic =  'new-leaf';
		}
		file += 'm';
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
	
	if (checkKK()) {
		setAudioUrl((Math.floor((Math.random() * 36) + 1).toString()));
	}
	else {
		if(checkLive())
		{
			updateWeatherCond();
		}
		setAudioUrl(formatHour(hour()));
	}
	
	updateBadge();
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
	else if (!inKK && !exitingKK && (hour() !== playingHour || (currentMusic !== options.music && !checkLive()))) {
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
		//updateBadge();
		audio.play();
		chrome.browserAction.setIcon({
			path : "/icon_38_leaf-02.png"
		});
	}
	else {
		audio.pause();
		//updateBadge(-1);
		chrome.browserAction.setIcon({
			path : "/icon_38_leaf-01.png"
		});
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
function updateBadge() {
	if(checkLive() && options.badgeWeather)
	{
		chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });
		chrome.browserAction.setBadgeText({ text: weather });
	}
	else
		chrome.browserAction.setBadgeText({ text: '' });
}

// check all tabs for playing audio, process tabs in callback
function tabAudio() {
	if (audio.paused)
		return;
		
	return chrome.tabs.query({audible: true}, function(tabs){
		processTabs(tabs.length);
	});
	
	// process tabs, mute volume if 
	function processTabs(length) {		
		if(length)
			muteVolume();
		else
			fadeIn();
	}
}

// fade in from silence
function fadeIn() {
	chrome.browserAction.setIcon({
		path : "/icon_38_leaf-02.png"
	});
		
	var step = options.volume / 30.0;
	var fade = setInterval(function () {
		if (audio.volume < options.volume)
			audio.volume += step;
		else
			clearInterval(fade);
	}, 100);
	
}

//get current weather conditions using openweathermap: http://openweathermap.org/current
function updateWeatherCond() {
	var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + options.zipCode + "," + 
						options.countryCode + "&appid=e7f97bd1900b94491d3263f89cbe28d6";
						
	var request = new XMLHttpRequest();

	request.onreadystatechange = function()
		{
			if(request.readyState == 4 && request.status == 200)
			{
				LDResponse(JSON.parse(request.responseText));
			}
		}

	request.open("GET", url, true);
	request.send();
	
	function LDResponse(response)
	{
		if(response.cod == "200")
		{
			if(weather === false)
			{
				setTimeout(function() { playPause(true); }, 50);
			}
			
			weather = response.weather[0].main;
			
			if(weatherRain.indexOf(weather) > -1)
				weather = "Rain";
			else if(weatherSnow.indexOf(weather) > -1)
				weather = "Snow";
			else
				weather = "Clear";
		}
		else
		{
			alert("invalid zip/country code");
		}
	}
}

// Set the globe spinning.
function init() {
	if (typeof options === 'undefined') {
		getSyncedOptions();
	}
	
	playPause(!options.paused);
	
	// check every 15 seconds for a time/song change
	setInterval(updateMusic, 15000);	
	
	// check ever second if a tab has audio playing
	// still buggy and doesn't work like I'd like
	// only checks at start, must restart extension/browser to disable/enable after settings change
	if(options.enableAutoPause)
		setInterval(tabAudio, 1000);
		
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
		|| typeof changes.alwaysKK !== 'undefined'
		|| typeof changes.zipCode !== 'undefined'
		|| typeof changes.countryCode !== 'undefined'
		|| typeof changes.badgeWeather !== 'undefined')
		getSyncedOptions(musicCB);
});

// run this when the extension is first loaded.
getSyncedOptions(init);

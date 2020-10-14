// Manages the current state of the extension, views can register to it
// and it will notify certain events.

'use strict';

function StateManager() {

	let self = this;

	let options = {};
	let callbacks = {};

	let timeKeeper = new TimeKeeper();
	let tabAudio = new TabAudioHandler();
	let townTuneManager = new TownTuneManager();
	let badgeManager;
	let weatherManager;
	let isKKTime;
	let startup = true;
	let browserClosed = false;

	this.registerCallback = function (event, callback) {
		callbacks[event] = callbacks[event] || [];
		callbacks[event].push(callback);
	};

	this.getOption = function (option) {
		return options[option];
	};

	this.activate = function () {
		printDebug("Activating StateManager");

		isKKTime = timeKeeper.getDay() == 6 && timeKeeper.getHour() >= 20;
		getSyncedOptions(() => {
			if (!badgeManager) badgeManager = new BadgeManager(this.registerCallback, options.enableBadgeText);

			if (!weatherManager) {
				weatherManager = new WeatherManager(options.zipCode, options.countryCode);
				weatherManager.registerChangeCallback(() => {
					if (!isKK() && isLive()) {
						let musicAndWeather = getMusicAndWeather();

						// Sends a different event on startup to get the "hourMusic" desktop notification.
						if (startup) {
							notifyListeners("hourMusic", [timeKeeper.getHour(), musicAndWeather.weather, musicAndWeather.music, false]);
							startup = false;
						} else notifyListeners("weatherChange", [timeKeeper.getHour(), musicAndWeather.weather, musicAndWeather.music, false]);
					}
				});
			}

			notifyListeners("volume", [options.volume]);
			if (isKK()) notifyListeners("kkStart", [options.kkVersion]);
			else {
				let musicAndWeather = getMusicAndWeather();
				if (musicAndWeather.weather) notifyListeners("hourMusic", [timeKeeper.getHour(), musicAndWeather.weather, musicAndWeather.music, false]);
			}

			if (!tabAudio.activated) tabAudio.activate();
			else tabAudio.checkTabs(true);
		});
	};

	// Possible events include:
	// volume, kkStart, hourMusic, gameChange, weatherChange, pause, tabAudio, musicFailed
	function notifyListeners(event, args) {
		if (!options.paused || event === "pause" || event === "volume") {
			var callbackArr = callbacks[event] || [];
			for (var i = 0; i < callbackArr.length; i++) {
				callbackArr[i].apply(window, args);
			}
			printDebug("Notified listeners of " + event + " with args: " + args);
		}
	}

	function isKK() {
		return options.alwaysKK || (options.enableKK && isKKTime);
	}

	function isLive() {
		return options.weather == 'live';
	}

	// Retrieves all synced options, which are then stored in the 'options' variable
	// Default values to use if absent are specified
	function getSyncedOptions(callback) {
		chrome.storage.sync.get({
			volume: 0.5,
			music: 'new-horizons',
			weather: 'sunny',
			enableNotifications: true,
			enableKK: true,
			alwaysKK: false,
			kkVersion: 'live',
			paused: false,
			enableTownTune: true,
			absoluteTownTune: false,
			townTuneVolume: 0.75,
			//enableAutoPause: false,
			zipCode: "98052",
			countryCode: "us",
			enableBadgeText: true,
			tabAudio: 'pause',
			enableBackground: false,
			tabAudioReduceValue: 80,
			kkSelectedSongsEnable: false,
			kkSelectedSongs: []
		}, items => {
			options = items;
			if (typeof callback === 'function') callback();
		});
	}

	// Gets the current game based on the option, and weather if
	// we're using a live weather option.
	function getMusicAndWeather() {
		let data = {
			music: options.music,
			weather: options.weather
		};

		if (options.music === "game-random") {
			let games = [
				'animal-crossing',
				'wild-world',
				'new-leaf',
				'new-horizons'
			];

			data.music = games[Math.floor(Math.random() * games.length)];
		}

		if (isLive()) {
			if (!weatherManager.getWeather()) data.weather = null;
			else if (weatherManager.getWeather() == "Rain") data.weather = 'raining';
			else if (weatherManager.getWeather() == "Snow") data.weather = 'snowing';
			else data.weather = "sunny";
		} else if (options.weather == 'weather-random') {
			let weathers = [
				'sunny',
				'raining',
				'snowing'
			];

			data.weather = weathers[Math.floor(Math.random() * weathers.length)];
		}

		// If the weather is meant to be raining, and the chosen game is animal crossing, then we
		// override the weather to be snowing since there is no raining music for animal crossing.
		if (data.weather == 'raining' && data.music == 'animal-crossing') data.weather = 'snowing';

		return data;
	}

	// If we're not playing KK, let listeners know the hour has changed
	// If we enter KK time, let listeners know
	timeKeeper.registerHourlyCallback((day, hour) => {
		let wasKK = isKK();
		isKKTime = day == 6 && hour >= 20;
		if (isKK() && !wasKK) notifyListeners("kkStart", [options.kkVersion]);
		else if (!isKK()) {
			let musicAndWeather = getMusicAndWeather();
			notifyListeners("hourMusic", [hour, musicAndWeather.weather, musicAndWeather.music, true]);
			// Play hourly tune when paused, but only if town tune is enabled
			if (options.paused && (options.absoluteTownTune && options.enableTownTune)) townTuneManager.playTune(tabAudio.audible);
		}
	});

	// 'Updated options' listener callback
	// Detects that the user has updated an option
	// Updates the 'options' variable and notifies listeners of any pertinent changes
	chrome.storage.onChanged.addListener(changes => {
		printDebug('A data object has been updated: ', changes)
		let wasKK = isKK();
		let kkVersion = options.kkVersion;
		let oldTabAudio = this.getOption("tabAudio");
		let oldTabAudioReduce = this.getOption("tabAudioReduceValue");
		let oldBadgeTextEnabled = this.getOption("enableBadgeText");
		// Trigger 'options' variable update
		getSyncedOptions(() => {
			// Detect changes and notify corresponding listeners
			if ('zipCode' in changes) weatherManager.setZip(changes.zipCode.newValue);
			if ('countryCode' in changes) weatherManager.setCountry(changes.countryCode.newValue);
			if ('volume' in changes) notifyListeners("volume", [changes.volume.newValue]);
			if (('music' in changes || 'weather' in changes) && !isKK()) {
				let musicAndWeather = getMusicAndWeather();
				notifyListeners("gameChange", [timeKeeper.getHour(), musicAndWeather.weather, musicAndWeather.music]);
			}
			if ((isKK() && !wasKK) || (kkVersion != options.kkVersion && isKK()) || ('kkSelectedSongsEnable' in changes || 'kkSelectedSongs' in changes)) notifyListeners("kkStart", [options.kkVersion]);
			if (!isKK() && wasKK) {
				let musicAndWeather = getMusicAndWeather();
				notifyListeners("hourMusic", [timeKeeper.getHour(), musicAndWeather.weather, musicAndWeather.music, false]);
			}
			if (oldTabAudio != options.tabAudio || oldTabAudioReduce != options.tabAudioReduceValue) notifyListeners("tabAudio", [null, options.tabAudio, options.tabAudioReduceValue]);
			if (oldBadgeTextEnabled != options.enableBadgeText) badgeManager.updateEnabled(options.enableBadgeText);
		});
	});

	// play/pause when user clicks the extension icon
	chrome.browserAction.onClicked.addListener(toggleMusic);

	// play/pause when chrome closes and the option to play in background is disabled
	chrome.tabs.onRemoved.addListener(checkTabs);
	chrome.tabs.onCreated.addListener(checkTabs);
	setInterval(checkTabs, 1000);

	tabAudio.registerCallback(audible => {
		notifyListeners("tabAudio", [audible, options.tabAudio, options.tabAudioReduceValue]);
	});

	// Handle the user interactions in the media session dialogue.
	checkMediaSessionSupport(() => {
		navigator.mediaSession.setActionHandler('play', toggleMusic);
		navigator.mediaSession.setActionHandler('pause', toggleMusic);
	});

	function toggleMusic() {
		chrome.storage.sync.set({ paused: !options.paused }, function () {
			getSyncedOptions(() => {
				if (options.paused) notifyListeners("pause");
				else self.activate();
			});
		});
	}

	function checkTabs() {
		if (!options.enableBackground) {
			chrome.tabs.query({}, tabs => {
				if (tabs.length == 0) {
					if (browserClosed) return;
					notifyListeners("pause");
					browserClosed = true;
				} else if (browserClosed) {
					self.activate();
					browserClosed = false;
				}
			});
		}
	}

	// Make notifyListeners public to allow for easier notification sending.
	window.notify = notifyListeners;

	if (DEBUG_FLAG) {
		window.setTime = function (hour, playTownTune) {
			notifyListeners("hourMusic", [hour, options.weather, options.music, playTownTune]);
		};
	}

}

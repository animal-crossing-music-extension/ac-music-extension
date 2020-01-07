// Manages the current state of the extension, views can register to it
// and it will notify certain events.

'use strict';

function StateManager() {

	let self = this;

	let options = {};
	let callbacks = {};

	let timeKeeper = new TimeKeeper();
	let weatherManager;
	let isKKTime;

	this.registerCallback = function (event, callback) {
		callbacks[event] = callbacks[event] || [];
		callbacks[event].push(callback);
	};

	this.getOption = function (option) {
		return options[option];
	};

	this.activate = function () {
		isKKTime = timeKeeper.getDay() == 6 && timeKeeper.getHour() >= 20;
		getSyncedOptions(() => {
			if (!weatherManager) {
				weatherManager = new WeatherManager(options.zipCode, options.countryCode);
				weatherManager.registerChangeCallback(function () {
					if (!isKK() && isLive()) {
						let musicAndWeather = getMusicAndWeather();
						notifyListeners("gameChange", [timeKeeper.getHour(), musicAndWeather.weather, musicAndWeather.music]);
						notifyListeners("weatherChange", [musicAndWeather.weather]);
					}
				});
			}

			notifyListeners("volume", [options.volume]);
			if (isKK()) notifyListeners("kkStart");
			else {
				let musicAndWeather = getMusicAndWeather();
				notifyListeners("hourMusic", [timeKeeper.getHour(), musicAndWeather.weather, musicAndWeather.music, false]);
			}
		});
	};

	// Possible events include:
	// volume, kkStart, hourMusic, gameChange, weatherChange, pause
	function notifyListeners(event, args) {
		if (!options.paused || event === "pause") {
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

	// retrieve saved options
	function getSyncedOptions(callback) {
		chrome.storage.sync.get({
			volume: 0.5,
			music: 'new-leaf',
			weather: 'sunny',
			enableNotifications: true,
			enableKK: true,
			alwaysKK: false,
			paused: false,
			enableTownTune: true,
			//enableAutoPause: false,
			zipCode: "98052",
			countryCode: "us",
			enableBadgeText: true
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

		console.log(options.music)
		if (options.music === "random") {
			let games = [
				'animal-crossing',
				'wild-world',
				'new-leaf'
			];

			data.music = games[Math.floor(Math.random() * games.length)];
		}

		if (isLive()) {
			if (weatherManager.getWeather() == "Rain") data.weather = 'raining';
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
		if (isKK() && !wasKK) notifyListeners("kkStart");
		else if (!isKK()) {
			let musicAndWeather = getMusicAndWeather();
			notifyListeners("hourMusic", [hour, musicAndWeather.weather, musicAndWeather.music, true]);
		}
	});

	// Update our options object if stored options changes, and notify listeners
	// of any pertinent changes.
	chrome.storage.onChanged.addListener(changes => {
		let wasKK = isKK();
		let oldMusicAndWeather = getMusicAndWeather();
		getSyncedOptions(() => {
			if (typeof changes.zipCode !== 'undefined') weatherManager.setZip(options.zipCode);
			if (typeof changes.countryCode !== 'undefined') weatherManager.setCountry(options.countryCode);
			if (typeof changes.volume !== 'undefined') notifyListeners("volume", [options.volume]);
			if (typeof changes.music !== 'undefined' || typeof changes.weather && !isKK()) {
				let musicAndWeather = getMusicAndWeather();
				if (musicAndWeather.music != oldMusicAndWeather.music || musicAndWeather.weather != oldMusicAndWeather.weather)
					notifyListeners("gameChange", [timeKeeper.getHour(), musicAndWeather.weather, musicAndWeather.music]);
			}

			if (isKK() && !wasKK) notifyListeners("kkStart");
			if (!isKK() && wasKK) {
				let musicAndWeather = getMusicAndWeather();
				notifyListeners("hourMusic", [timeKeeper.getHour(), musicAndWeather.weather, musicAndWeather.music, false]);
			}
		});
	});

	// play/pause when user clicks the extension icon
	chrome.browserAction.onClicked.addListener(function () {
		chrome.storage.sync.set({ paused: !options.paused }, function () {
			getSyncedOptions(() => {
				if (options.paused) notifyListeners("pause");
				else self.activate();
			});
		});
	});

	// Gives easy access to the notifyListeners function if
	// we're debugging.
	if (DEBUG_FLAG) {
		window.notify = notifyListeners;
		window.setTime = function (hour, playTownTune) {
			notifyListeners("hourMusic", [hour, options.weather, options.music, playTownTune]);
		};
	}

}

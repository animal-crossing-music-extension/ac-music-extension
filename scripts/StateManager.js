// Manages the current state of the extension, views can register to it
// and it will notify certain events.

'use strict';

function StateManager() {

	var self = this;

	var options = {};
	var callbacks = {};

	var timeKeeper = new TimeKeeper();
	var isKKTime;
	
	var weatherRain = ['Thunderstorm', 'Drizzle', 'Rain', 'Mist'];
	var weatherSnow = ['Snow', 'Fog'];
	var weather = "Clear";

	this.registerCallback = function(event, callback) {
		callbacks[event] = callbacks[event] || [];
		callbacks[event].push(callback);
	};

	this.getOption = function(option) {
		return options[option];
	};

	this.activate = function() {
		isKKTime = timeKeeper.getDay() == 6 && timeKeeper.getHour() >= 20;
		getSyncedOptions(function() {
			notifyListeners("volume", [options.volume]);
			if (isKK()) {
				notifyListeners("kkStart");
			}
			else if(isLive()) {
				if(options.music == 'new-leaf-live') {
					updateWeatherCond(options.zipCode, options.countryCode, function(response) {
					if(response.cod == 200) {
						weather = response.weather[0].main;
						if(weatherRain.indexOf(weather) > -1)
							weather = "Rain";
						else if(weatherSnow.indexOf(weather) > -1)
							weather = "Snow";
						else
							weather = "Clear";
						notifyListeners("weatherMusic", [timeKeeper.getHour(), options.music, weather, false]);
					}
					else
						alert(JSON.stringify(response));
					});
				}
			}
			else {
				notifyListeners("hourMusic", [timeKeeper.getHour(), options.music, false]);
			}
		});
	};

	// Possible events include:
	// volume, kkStart, hourMusic, weatherMusic, gameChange, weatherChange, pause
	function notifyListeners(event, args) {
		if (!options.paused) {
			var callbackArr = callbacks[event] || [];
			for(var i = 0; i < callbackArr.length; i++) {
				callbackArr[i].apply(window, args);
			}
		}
	}

	function isKK() {
		return options.alwaysKK || (options.enableKK && isKKTime);
	}
	
	function isLive() {
		return options.music == 'new-leaf-live';
	}

	// retrieve saved options
	function getSyncedOptions(callback) {
		chrome.storage.sync.get({
			volume: 0.5,
			music: 'new-leaf',
			enableNotifications: true,
			enableKK: true,
			alwaysKK: false,
			paused: false,
			enableTownTune: true,
			//enableAutoPause: false,
			zipCode: "98052",
			countryCode: "us",
			enableBadgeText: true
		}, function(items) {
			options = items;
			if (typeof callback === 'function') {
				callback();
			}
		});
	}

	// If we're not playing KK, let listeners know the hour has changed
	// If we enter KK time, let listeners know
	timeKeeper.registerHourlyCallback(function(day, hour) {
		var wasKK = isKK();
		isKKTime = day == 6 && hour >= 20;
		if (isKK() && !wasKK) {
			notifyListeners("kkStart");
		}
		else if(isLive()) {
			if(options.music == 'new-leaf-live') {
				updateWeatherCond(options.zipCode, options.countryCode, function(response) {
				if(response.cod == 200) {
					weather = response.weather[0].main;
					if(weatherRain.indexOf(weather) > -1)
						weather = "Rain";
					else if(weatherSnow.indexOf(weather) > -1)
						weather = "Snow";
					else
						weather = "Clear";
					notifyListeners("weatherMusic", [timeKeeper.getHour(), options.music, weather, true]);
				}
				else
					alert(JSON.stringify(response));
				});
			}
		}
		else if (!isKK()) {
			notifyListeners("hourMusic", [hour, options.music, true]);
		}
	});

	// Update our options object if stored options changes, and notify listeners
	// of any pertinent changes.
	chrome.storage.onChanged.addListener(function(changes, namespace) {
		var wasKK = isKK();
		getSyncedOptions(function() {
			if (typeof changes.volume !== 'undefined') {
				notifyListeners("volume", [options.volume]);
			}
			if (typeof changes.music !== 'undefined' && !isLive() && !isKK()) {
				notifyListeners("gameChange", [timeKeeper.getHour(), options.music]);
			}
			if (!isKK() && isLive() && (typeof changes.music !== 'undefined' || typeof changes.zipCode !== 'undefined' || typeof changes.countryCode !== 'undefined')) {
				notifyListeners("weatherChange", [timeKeeper.getHour(), options.music, weather]);
			}
			if (isKK() && !wasKK) {
				notifyListeners("kkStart");
			}
			if (!isKK() && wasKK) {
				notifyListeners("hourMusic", [timeKeeper.getHour(), options.music]);
			}
		});
	});

	// play/pause when user clicks the extension icon
	chrome.browserAction.onClicked.addListener(function() {
		chrome.storage.sync.set({ paused: !options.paused }, function() {
			if (options.paused) {
				self.activate();
			} else {
				notifyListeners("pause");
			}
		});
	});

}
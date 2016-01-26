// Manages the current state of the extension, views can register to it
// and it will notify certain events.

'use strict';

function StateManager() {

	var self = this;

	var options = {};
	var callbacks = {};

	var timeKeeper = new TimeKeeper();
	var weatherManager;
	var isKKTime;

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
		if(!weatherManager) {
			weatherManager = new WeatherManager(options.zipCode, options.countryCode);
			weatherManager.registerChangeCallback(function() {
				if(!isKK() && options.music == 'new-leaf-live') {
					notifyListeners("gameChange", [timeKeeper.getHour(), getMusic()]);
					notifyListeners("weatherChange", [weatherManager.getWeather()]);
				}
			});
		}

			notifyListeners("volume", [options.volume]);
			if (isKK()) {
				notifyListeners("kkStart");
			}
			else {
				notifyListeners("hourMusic", [timeKeeper.getHour(), getMusic(), false]);
			}
		});
	};

	// Possible events include:
	// volume, kkStart, hourMusic, weatherMusic, gameChange, weatherChange, pause
	function notifyListeners(event, args) {
		if (!options.paused || event === "pause") {
			var callbackArr = callbacks[event] || [];
			for(var i = 0; i < callbackArr.length; i++) {
				callbackArr[i].apply(window, args);
			}
			printDebug("Notified listeners of " + event + " with args: " + args);
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
	
	// Gets the current game based on the option, and weather if
	// we're using a live weather option.
	function getMusic() {
		if(options.music == 'new-leaf-live') {
			if(weatherManager.getWeather() == "Rain")
				return "new-leaf-raining";
			else if(weatherManager.getWeather() == "Snow")
				return "new-leaf-snowing";
			else
				return "new-leaf";			
		}
		else
			return options.music;
	}
	
	// get current weather conditions using openweathermap: http://openweathermap.org/current
	function updateWeatherCond(zip, country, cb) {
		//if appid is not valid nothing will be returned
		var appid = "e7f97bd1900b94491d3263f89cbe28d6";
		var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "," + country + "&appid=" + appid;

		var request = new XMLHttpRequest();

		request.onreadystatechange = function() {
				if(request.readyState == 4 && request.status == 200) {
					if( typeof cb === 'function' )
						cb(JSON.parse(request.responseText));
				}
			}

		request.open("GET", url, true);
		request.send();
	}

	// If we're not playing KK, let listeners know the hour has changed
	// If we enter KK time, let listeners know
	timeKeeper.registerHourlyCallback(function(day, hour) {
		var wasKK = isKK();
		isKKTime = day == 6 && hour >= 20;
		if (isKK() && !wasKK) {
			notifyListeners("kkStart");
		}
		else if (!isKK()) {
			notifyListeners("hourMusic", [hour, getMusic(), true]);
		}
	});

	// Update our options object if stored options changes, and notify listeners
	// of any pertinent changes.
	chrome.storage.onChanged.addListener(function(changes, namespace) {
		var wasKK = isKK();
		var oldMusic = getMusic();
		getSyncedOptions(function() {
			if(typeof changes.zipCode !== 'undefined') {
				weatherManager.setZip(options.zipCode);
			}
			if(typeof changes.countryCode !== 'undefined') {
				weatherManager.setCountry(options.countryCode);
			}
			if (typeof changes.volume !== 'undefined') {
				notifyListeners("volume", [options.volume]);
			}
			if (typeof changes.music !== 'undefined' && !isKK() && getMusic() != oldMusic) {
				notifyListeners("gameChange", [timeKeeper.getHour(), getMusic()]);
			}
			if (isKK() && !wasKK) {
				notifyListeners("kkStart");
			}
			if (!isKK() && wasKK) {
<<<<<<< HEAD
				notifyListeners("hourMusic", [timeKeeper.getHour(), getMusic()]);
=======
				notifyListeners("hourMusic", [timeKeeper.getHour(), options.music, false]);
>>>>>>> refs/remotes/JdotCarver/master
			}
		});
	});

	// play/pause when user clicks the extension icon
	chrome.browserAction.onClicked.addListener(function() {
		chrome.storage.sync.set({ paused: !options.paused }, function() {
			getSyncedOptions(function() {
				if (options.paused) {
					notifyListeners("pause");
				} else {
					self.activate();
				}
			});
		});
	});
<<<<<<< HEAD
=======

	// Gives easy access to the notifyListeners function if
	// we're debugging.
	if(DEBUG_FLAG) {
		window.notify = notifyListeners;
		window.setTime = function(hour, playTownTune) {
			notifyListeners("hourMusic", [hour, options.music, playTownTune]);
		};
	}

>>>>>>> refs/remotes/JdotCarver/master
}
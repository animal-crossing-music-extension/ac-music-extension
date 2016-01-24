// Manages the current state of the extension, views can register to it
// and it will notify certain events.

'use strict';

function StateManager() {

	var self = this;

	var options = {};
	var callbacks = {};

	var timeKeeper = new TimeKeeper();
	var isKKTime;
<<<<<<< HEAD
	
	var weatherRain = ['Thunderstorm', 'Drizzle', 'Rain', 'Mist'];
	var weatherSnow = ['Snow', 'Fog'];
	var weather = "Clear";
=======
>>>>>>> refs/remotes/JdotCarver/master

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
<<<<<<< HEAD
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
=======
			} else {
>>>>>>> refs/remotes/JdotCarver/master
				notifyListeners("hourMusic", [timeKeeper.getHour(), options.music, false]);
			}
		});
	};

	// Possible events include:
<<<<<<< HEAD
	// volume, kkStart, hourMusic, weatherMusic, gameChange, weatherChange, pause
=======
	// volume, kkStart, hourMusic, gameChange, pause
>>>>>>> refs/remotes/JdotCarver/master
	function notifyListeners(event, args) {
		if (!options.paused || event === "pause") {
			var callbackArr = callbacks[event] || [];
			for(var i = 0; i < callbackArr.length; i++) {
				callbackArr[i].apply(window, args);
			}
		}
	}

	function isKK() {
		return options.alwaysKK || (options.enableKK && isKKTime);
	}
<<<<<<< HEAD
	
	function isLive() {
		return options.music == 'new-leaf-live';
	}
=======
>>>>>>> refs/remotes/JdotCarver/master

	// retrieve saved options
	function getSyncedOptions(callback) {
		chrome.storage.sync.get({
			volume: 0.5,
			music: 'new-leaf',
			enableNotifications: true,
			enableKK: true,
			alwaysKK: false,
			paused: false,
<<<<<<< HEAD
			enableTownTune: true,
			//enableAutoPause: false,
			zipCode: "98052",
			countryCode: "us",
			enableBadgeText: true
=======
			enableTownTune: true
>>>>>>> refs/remotes/JdotCarver/master
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
<<<<<<< HEAD
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
=======
		} else if (!isKK()) {
>>>>>>> refs/remotes/JdotCarver/master
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
<<<<<<< HEAD
			if (typeof changes.music !== 'undefined' && !isLive() && !isKK()) {
				notifyListeners("gameChange", [timeKeeper.getHour(), options.music]);
			}
			if (!isKK() && isLive() && (typeof changes.music !== 'undefined' || typeof changes.zipCode !== 'undefined' || typeof changes.countryCode !== 'undefined')) {
				notifyListeners("weatherChange", [timeKeeper.getHour(), options.music, weather]);
			}
=======
			if (typeof changes.music !== 'undefined' && !isKK()) {
				notifyListeners("gameChange", [timeKeeper.getHour(), options.music]);
			}
>>>>>>> refs/remotes/JdotCarver/master
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
=======
>>>>>>> refs/remotes/JdotCarver/master
}
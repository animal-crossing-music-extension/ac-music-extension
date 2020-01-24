// Handles fetching the new weather and notifying a callback when it changes

'use strict';

function WeatherManager(zip, country) {
	let self = this;

	let timeout;
	let callback;

	let weather;

	this.registerChangeCallback = function (cb) {
		callback = cb;
	};

	this.setZip = function (newZip) {
		zip = newZip;
	};

	this.setCountry = function (newCountry) {
		country = newCountry;
		restartCheckLoop();
	};

	this.getWeather = function () {
		return weather;
	};

	// Checks the weather, and restarts the loop
	function restartCheckLoop() {
		if (timeout) clearTimeout(timeout);
		timeout = null;
		weatherCheckLoop();
	}

	// Checks the weather every 10 minutes, calls callback if it's changed
	let weatherCheckLoop = function () {
		let url = `https://ac.pikadude.me/weather/${country}/${zip}`
		let request = new XMLHttpRequest();

		request.onload = function () {
			if (request.status == 200 || request.status == 304) {
				let response = JSON.parse(request.responseText);
				if (response.weather !== weather) {
					let oldWeather = self.getWeather();
					weather = response.weather;
					if (weather !== oldWeather && typeof callback === 'function') callback();
				}
			} else err();
		}

		request.onerror = err;

		function err() {
			if (!weather) {
				weather = "Clear";
				callback();
			}
		}

		request.open("GET", url, true);
		request.send();
		timeout = setTimeout(weatherCheckLoop, 600000);
	};

	weatherCheckLoop();

	if (DEBUG_FLAG) {
		window.changeWeather = function (newWeather) {
			weather = newWeather;
			callback();
		}
	}
}

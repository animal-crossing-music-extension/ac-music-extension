// Handles fetching the new weather and notifying a callback when it changes

'use strict';

function WeatherManager(zip, country) {
	var self = this;

	var timeout;
	var callback;

	var weather;
	var checked = false;

	var weatherRain = ['Thunderstorm', 'Drizzle', 'Rain', 'Mist'];
 	var weatherSnow = ['Snow', 'Fog'];

	this.registerChangeCallback = function(cb) {
		callback = cb;
	};

	this.setZip = function(newZip) {
		zip = newZip;
		restartCheckLoop();
	};

	this.setCountry = function(newCountry) {
		country = newCountry;
		restartCheckLoop();
	};

	this.getWeather = function() {
		if (!checked) return "Unknown";

		if(~weatherRain.indexOf(weather)) {
			return "Rain";
		} else if(~weatherSnow.indexOf(weather)) {
			return "Snow";
		} else {
			return "Clear";
		}
	};

	// Checks the weather, and restarts the loop
	function restartCheckLoop() {
		if(timeout) clearTimeout(timeout);
		timeout = null;
		weatherCheckLoop();
	}
	
	// Checks the weather every 10 minutes, calls callback if it's changed
	var weatherCheckLoop = function() {
		//if appid is not valid nothing will be returned
	 	var appid = "e7f97bd1900b94491d3263f89cbe28d6";
	 	var url = `http://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&appid=${appid}`
	 
	 	var request = new XMLHttpRequest();
	 
	 	request.onreadystatechange = function() {
 			if(request.readyState == 4 && request.status == 200) {
				checked = true;
 				var response = JSON.parse(request.responseText);
 				if( response.cod == "200" && response.weather[0].main !== weather) {
					var oldWeather = self.getWeather();
 					weather = response.weather[0].main;
 					if(self.getWeather() !== oldWeather && typeof callback === 'function' ) {
 						callback();
 					}
 				}
 			}
 		}
	 
	 	request.open("GET", url, true);
	 	request.send();
	 	timeout = setTimeout(weatherCheckLoop, 600000);
	};

	weatherCheckLoop();
	
	if(DEBUG_FLAG) {
		window.changeWeather = function(newWeather) {
			weather = newWeather;
			callback();
		}
	}
}

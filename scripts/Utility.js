// Globally accessable helper functions

'use strict';

// format text for the badge and for the song URL
function formatHour(time) {
	if (time === -1) {
		return '';
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

function getSrc(game, hour, weather) {
	var src;
	if(game == 'new-leaf-live') {		
		if(weather == "Rain")
			src = '../new-leaf-raining';
		else if(weather == "Snow")
			src =  '../new-leaf-snowing';
		else
			src =  '../new-leaf';
	}
	else
		src = '../' + game;
		
	src += '/' + formatHour(hour) + 'm.ogg';
	return src;
}
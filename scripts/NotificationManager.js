// Handles Chrome notifications

'use strict';

function NotificationManager(addEventListener, isEnabled) {

	function popMusicNotification(hour) {
		chrome.notifications.create('animal-crossing-music', {
			type: 'basic',
			title: 'Animal Crossing Music',
			message: 'It is now ' + formatHour(hour) + 'm!',
			iconUrl: '../img/clock.png'
		});
	}
	
	function popWeatherNotification(weather) {
		var weatherString;
		switch(weather) {
			case "Rain":
				weatherString = "raining";
				break;
			case "Snow":
				weatherString = "snowing";
				break;
			default:
				weatherString = "clear";
		}
		
		chrome.notifications.create('animal-crossing-music', {
			type: 'basic',
			title: 'Animal Crossing Music',
			message: 'It is now ' + weatherString + '!',
			iconUrl: '../img/clock.png'
		});
	}

	function popKKNotification() {
		chrome.notifications.create('animal-crossing-music', {
			type: 'basic',
			title: 'Animal Crossing Music',
			message: 'K.K. Slider has started to play!',
			iconUrl: '../img/clock.png'
		});

	}

	addEventListener("hourMusic", function(hour) {
		if (isEnabled()) {
			popMusicNotification(hour);
		}
	});
	
	addEventListener("weatherChange", function(weather) {
		if (isEnabled()) {
			popWeatherNotification(weather);
		}
	});

	addEventListener("kkStart", function() {
		if (isEnabled()) {
			popKKNotification();
		}
	});

}
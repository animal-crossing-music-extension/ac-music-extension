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
		var msg;
		if(weather == "Rain")
			msg = "It's rainy outside!"
		else if(weather == "Snow")
			msg = "It's snowing outiside!"
		else
			msg = "The weather is clear!"
		
		chrome.notifications.create('animal-crossing-music', {
			type: 'basic',
			title: 'Animal Crossing Music',
			message: msg,
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
	
	addEventListener("weatherMusic", function(hour, music, weather) {
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
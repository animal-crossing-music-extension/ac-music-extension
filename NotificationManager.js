// Handles Chrome notifications and the badge on the icon
// This could potentially be split into two objects.

function NotificationManager(addEventListener, isEnabled) {

	function popMusicNotification(hour) {
		chrome.notifications.create('animal-crossing-music', {
			type: 'basic',
			title: 'Animal Crossing Music',
			message: 'It is now ' + formatHour(hour) + 'm!',
			iconUrl: 'clock.png'
		});
	}

	function popKKNotification() {
		chrome.notifications.create('animal-crossing-music', {
			type: 'basic',
			title: 'Animal Crossing Music',
			message: 'K.K. Slider has started to play!',
			iconUrl: 'clock.png'
		});

	}

	addEventListener("hourMusic", function(hour) {
		chrome.browserAction.setBadgeText({ text: formatHour(hour) });
		if(isEnabled()) {
			popMusicNotification(hour);
		}
	});

	addEventListener("kkStart", function() {
		chrome.browserAction.setBadgeText({ text: "KK" });
		if(isEnabled()) {
			popKKNotification();
		}
	});

	addEventListener("pause", function() {
		chrome.browserAction.setBadgeText({ text: "" });
	});

	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });

}
// Handles the badge on the icon

'use strict';

function BadgeManager(addEventListener, isEnabled) {

	setIcon('default');

	addEventListener("hourMusic", function(hour) {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: formatHour(hour) });
		}
		setIcon('default');
		//setIcon('play');
	});

	addEventListener("kkStart", function() {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: "KK" });
		}
		setIcon('kk');
	});

	addEventListener("pause", function() {
		chrome.browserAction.setBadgeText({ text: "" });
		//setIcon('pause')
	});
	
	function setIcon(icon) {
		if (icon == 'default') {
			chrome.storage.sync.get('icon', function(icon) {
				console.log(icon.icon);
			    if (icon.icon == 'leaf-icon')
			    	setIcon('leaf');
			    else
			    	setIcon('kk');
			});
		}
		else {
			var icon_path;
			if (icon == 'pause')
				icon_path = 'img/icon_38_leaf-02.png';
			else if (icon == 'play')
				icon_path = 'img/icon_38_leaf-01.png';
			else if (icon == 'leaf')
				icon_path = 'img/icon_38_leaf.png';
			else if (icon == 'kk')
				icon_path = 'img/icon_38_kk.png';
			console.log(icon_path);
			chrome.browserAction.setIcon({
				path: icon_path
			});
		}
	}

	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });
}
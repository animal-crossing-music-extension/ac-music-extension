'use strict';

function saveOptions() {
	var volume = document.getElementById('volume').value;
	var enableNotifications = document.getElementById('enable-notifications').checked;
	// 2 separate KK variables to preserve compatibility with old versions
	var alwaysKK = document.getElementById('always-kk').checked;
	var enableKK = alwaysKK || document.getElementById('enable-kk').checked;

	var music;	
	if (document.getElementById('animal-forrest').checked) {
		music = 'animal-forrest';
	}
	else if (document.getElementById('wild-world').checked) {
		music = 'wild-world';
	}
	else if (document.getElementById('new-leaf').checked) {
		music = 'new-leaf';
	}
	else if (document.getElementById('new-leaf-snowing').checked) {
		music = 'new-leaf-snowing';
	}
	/*else if (document.getElementById('new-leaf-raining').checked) {
		music = 'new-leaf-raining';
	}*/
	
	chrome.storage.sync.set({
		volume: volume,
		music: music,
		enableNotifications: enableNotifications,
		enableKK: enableKK,
		alwaysKK: alwaysKK
	}, function() { });
}

function restoreOptions() {
	chrome.storage.sync.get({
		volume: 0.5,
		music: 'new-leaf',
		enableNotifications: true,
		enableKK: true,
		alwaysKK: false
	}, function(items) {
		document.getElementById('volume').value = items.volume;
		document.getElementById(items.music).checked = true;
		document.getElementById('enable-notifications').checked = items.enableNotifications;
		document.getElementById('no-kk').checked = true;
		document.getElementById('enable-kk').checked = items.enableKK;
		document.getElementById('always-kk').checked = items.alwaysKK;
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('volume').onchange = saveOptions;
document.getElementById('animal-forrest').onclick = saveOptions;
document.getElementById('wild-world').onclick = saveOptions;
document.getElementById('new-leaf').onclick = saveOptions;
document.getElementById('new-leaf-snowing').onclick = saveOptions;
document.getElementById('no-kk').onclick = saveOptions;
document.getElementById('enable-kk').onclick = saveOptions;
document.getElementById('always-kk').onclick = saveOptions;
document.getElementById('enable-notifications').onclick = saveOptions;

// About/Help
document.getElementById('get-help').onclick = function() {
	window.open('http://www.neogaf.com/forum/showthread.php?t=426040');
};
document.getElementById('report-an-issue').onclick = function() {
	window.open('http://www.neogaf.com/forum/private.php?do=newpm&u=20593');
};
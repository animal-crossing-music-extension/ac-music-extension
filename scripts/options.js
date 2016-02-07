'use strict';

function saveOptions() {
	var volume              = document.getElementById('volume').value;
	var enableNotifications = document.getElementById('enable-notifications').checked;
	// 2 separate KK variables to preserve compatibility with old versions
	var alwaysKK            = document.getElementById('always-kk').checked;
	var enableKK            = alwaysKK || document.getElementById('enable-kk').checked;
	var enableTownTune      = document.getElementById('enable-town-tune').checked;
	var zipCode             = document.getElementById('zip-code').value;
	var countryCode         = document.getElementById('country-code').value;
	var enableBadgeText     = document.getElementById('enable-badge').checked;

	var music;
	var currentSong;
	if (document.getElementById('animal-forrest').checked) {
		music = 'animal-forrest';
	}
	else if (document.getElementById('wild-world').checked) {
		music = 'wild-world';
	}
	else if (document.getElementById('wild-world-snowing').checked) {
		music = 'wild-world-snowing';
	}
	else if (document.getElementById('new-leaf').checked) {
		music = 'new-leaf';
	}
	else if (document.getElementById('new-leaf-raining').checked) {
		music = 'new-leaf-raining';
	}
	else if (document.getElementById('new-leaf-snowing').checked) {
		music = 'new-leaf-snowing';
	}
	else if (document.getElementById('new-leaf-live').checked) {
		music = 'new-leaf-live';
	}
	else if (document.getElementById('random').checked) {
		music = 'random';
	}

	chrome.storage.sync.set({
		volume             : volume,
		music              : music,
		enableNotifications: enableNotifications,
		enableKK           : enableKK,
		alwaysKK           : alwaysKK,
		enableTownTune     : enableTownTune,
		zipCode            : zipCode,
		countryCode        : countryCode,
		enableBadgeText    : enableBadgeText
	}, function() { });
}

function restoreOptions() {
	chrome.storage.sync.get({
		volume             : 0.5,
		music              : 'new-leaf',
		enableNotifications: true,
		enableKK           : true,
		alwaysKK           : false,
		enableTownTune     : true,
		zipCode            : "98052",
		countryCode        : "us",
		enableBadgeText    : true
	}, function(items) {
		document.getElementById('volume').value                 = items.volume;
		document.getElementById(items.music).checked            = true;
		document.getElementById('enable-notifications').checked = items.enableNotifications;
		document.getElementById('no-kk').checked                = true;
		document.getElementById('enable-kk').checked            = items.enableKK;
		document.getElementById('always-kk').checked            = items.alwaysKK;
		document.getElementById('enable-town-tune').checked     = items.enableTownTune;
		document.getElementById('zip-code').value               = items.zipCode;
		document.getElementById('country-code').value           = items.countryCode;
		document.getElementById('enable-badge').checked         = items.enableBadgeText;
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('volume').onchange              = saveOptions;
document.getElementById('animal-forrest').onclick       = saveOptions;
document.getElementById('wild-world').onclick           = saveOptions;
document.getElementById('wild-world-snowing').onclick   = saveOptions;
document.getElementById('new-leaf').onclick             = saveOptions;
document.getElementById('new-leaf-snowing').onclick     = saveOptions;
document.getElementById('new-leaf-raining').onclick     = saveOptions;
document.getElementById('new-leaf-live').onclick        = saveOptions;
document.getElementById('new-leaf-live').onclick        = saveOptions;
document.getElementById('random').onclick               = saveOptions;
document.getElementById('no-kk').onclick                = saveOptions;
document.getElementById('enable-kk').onclick            = saveOptions;
document.getElementById('always-kk').onclick            = saveOptions;
document.getElementById('enable-notifications').onclick = saveOptions;
document.getElementById('enable-town-tune').onclick     = saveOptions;
document.getElementById('enable-badge').onclick         = saveOptions;
document.getElementById('update-location').onclick      = saveOptions;

// About/Help
document.getElementById('get-help').onclick = function() {
	window.open('https://chrome.google.com/webstore/detail/animal-crossing-music/fcedlaimpcfgpnfdgjbmmfibkklpioop/support');
};
document.getElementById('report-an-issue').onclick = function() {
	window.open('https://chrome.google.com/webstore/detail/animal-crossing-music/fcedlaimpcfgpnfdgjbmmfibkklpioop/support');
};
document.getElementById('help-us-out').onclick = function() {
	window.open('https://github.com/JdotCarver/Animal-Crossing-Music-Extension/');
};

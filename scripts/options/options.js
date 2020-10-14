'use strict';

const onClickElements = [
	'animal-crossing',
	'wild-world',
	'new-leaf',
	'new-horizons',
	'game-random',
	'sunny',
	'snowing',
	'raining',
	'live',
	'weather-random',
	'no-kk',
	'enable-kk',
	'always-kk',
	'enable-town-tune',
	'absolute-town-tune',
	'enable-notifications',
	'enable-badge',
	'kk-version-live',
	'kk-version-aircheck',
	'kk-version-both',
	'tab-audio-nothing',
	'tab-audio-reduce',
	'tab-audio-pause',
	'kk-songs-selection-enable'
];

const exclamationElements = [
	'live-weather-location-link',
	'town-tune-button-link'
]

// Formats an integer to percentage
function formatPercentage(number) {
	number = parseInt(number)
	if (number <= 0) return '0%'
	else if (number >= 100) return '100%'
	else if (number < 10) return `0${number}%`
	else return `${number}%`
}

function containsSpace(string) {
	return (string.indexOf(' ') >= 0);
}


window.onload = function () {
	restoreOptions();
	document.getElementById('version-number').textContent = 'Version ' + chrome.runtime.getManifest().version;
	document.getElementById('volume').onchange = saveOptions;
	document.getElementById('volume').oninput = function() {
		let volumeText = document.getElementById('volumeText');
		volumeText.innerHTML = `${formatPercentage(this.value*100)}`;
	};
	document.getElementById('townTuneVolume').onchange = saveOptions; // Maybe disable as to only save when clicking "save" button
	document.getElementById('townTuneVolume').oninput = function() {
		let ttVolumeText = document.getElementById('townTuneVolumeText');
		ttVolumeText.innerHTML = `${formatPercentage(this.value*100)}`;
	};

	onClickElements.forEach(el => {
		document.getElementById(el).onclick = saveOptions;
	});
	document.getElementById('update-location').onclick = validateWeather;
	document.getElementById('tab-audio-reduce-value').onchange = saveOptions;

	exclamationElements.forEach(el => {
		document.getElementById(el).onclick = () => {
			let element = document.getElementById(el.split('-link')[0]);
			element.style.animation = 'scrolled 1s';
			element.onanimationend = () => element.style.animation = null;
		}
	});

	let enableBackgroundEl = document.getElementById('enable-background');
	enableBackgroundEl.onclick = () => {
		chrome.permissions.contains({ permissions: ['background'] }, hasPerms => {
			if (enableBackgroundEl.checked) {
				chrome.permissions.contains({ permissions: ['background'] }, hasPerms => {
					if (hasPerms) saveOptions();
					else {
						chrome.permissions.request({ permissions: ['background'] }, hasPerms => {
							if (hasPerms) saveOptions();
							else enableBackgroundEl.checked = false;
						});
					}
				});
			} else if (hasPerms) chrome.permissions.remove({ permissions: ['background'] });
		});
	}

	document.getElementById('kk-songs-selection-enable').onchange = saveOptions;
	document.getElementById('kk-songs-selection').onchange = saveOptions;

	const kkSongsSelect = document.getElementById('kk-songs-selection');
	KKSongList.forEach((song) => {
		const songOption = document.createElement('option');
		songOption.text = song;
		songOption.value = song;
		kkSongsSelect.appendChild(songOption);
	});

	updateContributors();
}

function saveOptions() {
	let volume = document.getElementById('volume').value;
	let enableNotifications = document.getElementById('enable-notifications').checked;
	// 2 separate KK variables to preserve compatibility with old versions
	let alwaysKK = document.getElementById('always-kk').checked;
	let enableKK = alwaysKK || document.getElementById('enable-kk').checked;
	let enableTownTune = document.getElementById('enable-town-tune').checked;
	let absoluteTownTune = document.getElementById('absolute-town-tune').checked;
	let townTuneVolume   = document.getElementById('townTuneVolume').value;
	let zipCode = document.getElementById('zip-code').value;
	let countryCode = document.getElementById('country-code').value;
	let enableBadgeText = document.getElementById('enable-badge').checked;
	let enableBackground = document.getElementById('enable-background').checked;
	let tabAudioReduceValue = document.getElementById('tab-audio-reduce-value').value;
	let kkSelectedSongsEnable = document.getElementById('kk-songs-selection-enable').checked;
	let kkSelectedSongs = Array.from(document.getElementById('kk-songs-selection').selectedOptions).map(option => option.value);

	if (tabAudioReduceValue > 100) {
		document.getElementById('tab-audio-reduce-value').value = 100;
		tabAudioReduceValue = 100;
	}
	if (tabAudioReduceValue < 0) {
		document.getElementById('tab-audio-reduce-value').value = 0;
		tabAudioReduceValue = 0;
	}

	let music;
	let weather;
	if (document.getElementById('animal-crossing').checked) music = 'animal-crossing';
	else if (document.getElementById('wild-world').checked) music = 'wild-world';
	else if (document.getElementById('new-leaf').checked) music = 'new-leaf';
	else if (document.getElementById('new-horizons').checked) music = 'new-horizons';
	else if (document.getElementById('game-random').checked) music = 'game-random';

	if (document.getElementById('sunny').checked) weather = 'sunny';
	else if (document.getElementById('snowing').checked) weather = 'snowing';
	else if (document.getElementById('raining').checked) weather = 'raining';
	else if (document.getElementById('live').checked) weather = 'live';
	else if (document.getElementById('weather-random').checked) weather = 'weather-random';

	let kkVersion;
	if (document.getElementById('kk-version-live').checked) kkVersion = 'live';
	else if (document.getElementById('kk-version-aircheck').checked) kkVersion = 'aircheck';
	else if (document.getElementById('kk-version-both').checked) kkVersion = 'both';

	let tabAudio;
	if (document.getElementById('tab-audio-reduce').checked) tabAudio = 'reduce';
	else if (document.getElementById('tab-audio-pause').checked) tabAudio = 'pause';
	else if (document.getElementById('tab-audio-nothing').checked) tabAudio = 'nothing';

	document.getElementById('raining').disabled = music == 'animal-crossing';
	document.getElementById('absolute-town-tune').disabled = !enableTownTune;

	let enabledKKVersion = !(document.getElementById('always-kk').checked || document.getElementById('enable-kk').checked);

	document.getElementById('music-selection').querySelectorAll('input').forEach(updateChildrenState.bind(null, alwaysKK));

	document.getElementById('weather-selection').querySelectorAll('input').forEach(updateChildrenState.bind(null, alwaysKK))

	document.getElementById('kk-version-selection').querySelectorAll('input').forEach(updateChildrenState.bind(null, enabledKKVersion));

	document.getElementById('kk-songs-selection').disabled = !kkSelectedSongsEnable;

	chrome.storage.sync.set({
		volume,
		music,
		weather,
		enableNotifications,
		enableKK,
		alwaysKK,
		kkVersion,
		enableTownTune,
		absoluteTownTune,
		townTuneVolume,
		zipCode,
		countryCode,
		enableBadgeText,
		enableBackground,
		tabAudio,
		tabAudioReduceValue,
		kkSelectedSongsEnable,
		kkSelectedSongs
	});
}

function restoreOptions() {
	chrome.storage.sync.get({
		volume: 0.5,
		music: 'new-horizons',
		weather: 'sunny',
		enableNotifications: true,
		enableKK: true,
		alwaysKK: false,
		kkVersion: 'live',
		enableTownTune: true,
		absoluteTownTune: false,
		townTuneVolume: 0.75,
		zipCode: "98052",
		countryCode: "us",
		enableBadgeText: true,
		tabAudio: 'pause',
		enableBackground: false,
		tabAudioReduceValue: 80,
		kkSelectedSongsEnable: false,
		kkSelectedSongs: []
	}, items => {
		document.getElementById('volume').value = items.volume;
		document.getElementById('volumeText').innerHTML = `${formatPercentage(items.volume*100)}`;
		document.getElementById(items.music).checked = true;
		document.getElementById(items.weather).checked = true;
		document.getElementById('enable-notifications').checked = items.enableNotifications;
		document.getElementById('no-kk').checked = true;
		document.getElementById('enable-kk').checked = items.enableKK;
		document.getElementById('always-kk').checked = items.alwaysKK;
		document.getElementById('kk-version-' + items.kkVersion).checked = true;
		document.getElementById('enable-town-tune').checked = items.enableTownTune;
		document.getElementById('absolute-town-tune').checked = items.absoluteTownTune;
		document.getElementById('townTuneVolume').value = items.townTuneVolume;
		document.getElementById('townTuneVolumeText').innerHTML = `${formatPercentage(items.townTuneVolume*100)}`;
		document.getElementById('zip-code').value = items.zipCode;
		document.getElementById('country-code').value = items.countryCode;
		document.getElementById('enable-badge').checked = items.enableBadgeText;
		document.getElementById('enable-background').checked = items.enableBackground;
		document.getElementById('tab-audio-' + items.tabAudio).checked = true;
		document.getElementById('tab-audio-reduce-value').value = items.tabAudioReduceValue;
		document.getElementById('kk-songs-selection-enable').checked = items.kkSelectedSongsEnable;

		// Disable raining if the game is animal crossing, since there is no raining music for animal crossing.
		document.getElementById('raining').disabled = items.music == 'animal-crossing';
		document.getElementById('absolute-town-tune').disabled = !items.enableTownTune;

		let enabledKKVersion = !(items.alwaysKK || items.enableKK);

		document.getElementById('music-selection').querySelectorAll('input').forEach(updateChildrenState.bind(null, items.alwaysKK));
		document.getElementById('weather-selection').querySelectorAll('input').forEach(updateChildrenState.bind(null, items.alwaysKK));
		document.getElementById('kk-version-selection').querySelectorAll('input').forEach(updateChildrenState.bind(null, enabledKKVersion));

		const kkSongsSelect = document.getElementById('kk-songs-selection');
		kkSongsSelect.disabled = !items.kkSelectedSongsEnable;

		items.kkSelectedSongs.forEach((song) => {
			const songIndex = Array.from(kkSongsSelect.options).findIndex((option, idx) => {
				return option.value === song ? String(idx) : false; // Why String()?: if idx is 0, the function returns -1
			});
			kkSongsSelect.options[songIndex].selected = 'selected';
		});
	});

}

function validateWeather() {
	let updateLocationEl = document.getElementById('update-location');
	updateLocationEl.textContent = "Validating...";
	updateLocationEl.disabled = true;

	let zip = document.getElementById('zip-code').value.trim();
	let country = document.getElementById('country-code').value.trim();
	if (zip == '') {
		responseMessage('You must specify a zip/post code.');
		return;
	}
	if (country == '') {
		responseMessage('You must specify an ISO code.');
		return;
	}

	let url = `https://acmusicext.com/api/weather-v1/${country}/${zip}`;
	let request = new XMLHttpRequest();

	request.onload = function () {
		let response;
		try {
			response = JSON.parse(request.responseText);
		} catch (Exception) {
			responseMessage();
			return;
		}

		if (request.status == 200) responseMessage(`Success! The current weather status in ${response.city}, ${response.country} is "${response.weather}"`, true);
		else {
			if (response.error) {
				if ((response.error === "City not found") && (containsSpace(zip))) {
					response.error += " – Try with only the first part of the zip code."
				}
				responseMessage(response.error);
			}
			else responseMessage();
		}
	}

	request.onerror = () => responseMessage();

	request.open("GET", url, true);
	request.send();

	function responseMessage(message = 'An unknown error occurred', success = false) {
		let weatherResponseEl = document.getElementById('weather-response');
		if (success == true) {
			weatherResponseEl.style.color = "#39d462";
			saveOptions();
		} else weatherResponseEl.style.color = "#d43939";
		weatherResponseEl.textContent = message;

		updateLocationEl.textContent = "Update Location";
		updateLocationEl.disabled = false;
	}
}

function updateChildrenState(disabled, childElement){
	childElement.disabled = disabled
}

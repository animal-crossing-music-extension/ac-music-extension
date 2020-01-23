'use strict';

const onClickElements = [
	'animal-crossing',
	'wild-world',
	'new-leaf',
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
	'enable-notifications',
	'enable-badge',
	'kk-version-live',
	'kk-version-aircheck',
	'kk-version-both',
	'tab-audio-nothing'
];

const tabAudioElements = [
	'tab-audio-reduce',
	'tab-audio-pause'
]

window.onload = function () {
	restoreOptions();

	document.getElementById('version-number').textContent = 'Version ' + chrome.runtime.getManifest().version;

	document.getElementById('volume').oninput = saveOptions;
	onClickElements.forEach(el => {
		document.getElementById(el).onclick = saveOptions;
	});
	tabAudioElements.forEach(el => {
		document.getElementById(el).onclick = () => {
			chrome.permissions.contains({ permissions: ['tabs'] }, hasTabs => {
				if (hasTabs) saveOptions();
				else {
					let modal = document.getElementById('tabAudioModal');
					modal.style.display = 'block';

					document.getElementById('tabAudioModalDismiss').onclick = () => {
						modal.style.display = "none";
						chrome.permissions.request({ permissions: ['tabs'] }, hasTabs => {
							if (hasTabs) saveOptions();
							else {
								tabAudioElements.forEach(el => document.getElementById(el).checked = false);
								document.getElementById('tab-audio-nothing').checked = true;
							}
						});
					};
				}
			});
		}
	});
	document.getElementById('update-location').onclick = validateWeather;
	document.getElementById('tab-audio-reduce-value').onchange = saveOptions;

	updateContributors();
}

function saveOptions() {
	let volume = document.getElementById('volume').value;
	let enableNotifications = document.getElementById('enable-notifications').checked;
	// 2 separate KK variables to preserve compatibility with old versions
	let alwaysKK = document.getElementById('always-kk').checked;
	let enableKK = alwaysKK || document.getElementById('enable-kk').checked;
	let enableTownTune = document.getElementById('enable-town-tune').checked;
	let zipCode = document.getElementById('zip-code').value;
	let countryCode = document.getElementById('country-code').value;
	let enableBadgeText = document.getElementById('enable-badge').checked;
	let tabAudioReduceValue = document.getElementById('tab-audio-reduce-value').value;

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

	let enabledKKVersion = !(document.getElementById('always-kk').checked || document.getElementById('enable-kk').checked);
	document.getElementById('kk-version-live').disabled = enabledKKVersion;
	document.getElementById('kk-version-aircheck').disabled = enabledKKVersion;
	document.getElementById('kk-version-both').disabled = enabledKKVersion;

	chrome.storage.sync.set({
		volume,
		music,
		weather,
		enableNotifications,
		enableKK,
		alwaysKK,
		kkVersion,
		enableTownTune,
		zipCode,
		countryCode,
		enableBadgeText,
		tabAudio,
		tabAudioReduceValue
	});
}

function restoreOptions() {
	chrome.storage.sync.get({
		volume: 0.5,
		music: 'new-leaf',
		weather: 'sunny',
		enableNotifications: true,
		enableKK: true,
		alwaysKK: false,
		kkVersion: 'live',
		enableTownTune: true,
		zipCode: "98052",
		countryCode: "us",
		enableBadgeText: true,
		tabAudio: 'nothing',
		tabAudioReduceValue: 80
	}, items => {
		document.getElementById('volume').value = items.volume;
		document.getElementById(items.music).checked = true;
		document.getElementById(items.weather).checked = true;
		document.getElementById('enable-notifications').checked = items.enableNotifications;
		document.getElementById('no-kk').checked = true;
		document.getElementById('enable-kk').checked = items.enableKK;
		document.getElementById('always-kk').checked = items.alwaysKK;
		document.getElementById('kk-version-' + items.kkVersion).checked = true;
		document.getElementById('enable-town-tune').checked = items.enableTownTune;
		document.getElementById('zip-code').value = items.zipCode;
		document.getElementById('country-code').value = items.countryCode;
		document.getElementById('enable-badge').checked = items.enableBadgeText;
		document.getElementById('tab-audio-' + items.tabAudio).checked = true;
		document.getElementById('tab-audio-reduce-value').value = items.tabAudioReduceValue;

		// Disable raining if the game is animal crossing, since there is no raining music for animal crossing.
		document.getElementById('raining').disabled = items.music == 'animal-crossing';

		let enabledKKVersion = !(document.getElementById('always-kk').checked || document.getElementById('enable-kk').checked);
		document.getElementById('kk-version-live').disabled = enabledKKVersion;
		document.getElementById('kk-version-aircheck').disabled = enabledKKVersion;
		document.getElementById('kk-version-both').disabled = enabledKKVersion;
	});
}

function validateWeather() {
	let updateLocationEl = document.getElementById('update-location');
	updateLocationEl.textContent = "Validating...";
	updateLocationEl.disabled = true;

	let zip = document.getElementById('zip-code').value;
	let country = document.getElementById('country-code').value;
	if (zip == '') {
		responseMessage('You must specify a zip code.');
		return;
	}
	if (country == '') {
		responseMessage('You must specify a country code.');
		return;
	}

	let url = `https://ac.pikadude.me/weather/${country}/${zip}`;
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
			if (response.error) responseMessage(response.error);
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
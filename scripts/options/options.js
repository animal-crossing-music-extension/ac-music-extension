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
		volumeText.innerText = `${formatPercentage(this.value*100)}`;
	};
	document.getElementById('townTuneVolume').onchange = saveOptions; // Maybe disable as to only save when clicking "save" button
	document.getElementById('townTuneVolume').oninput = function() {
		let ttVolumeText = document.getElementById('townTuneVolumeText');
		ttVolumeText.innerText = `${formatPercentage(this.value*100)}`;
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
	if (!(navigator.userAgentData)) enableBackgroundEl.disabled = true;
	enableBackgroundEl.onclick = () => {
		if (navigator.userAgentData) {
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
	}

	document.getElementById('kk-songs-selection-enable').onchange = saveOptions;
	document.getElementById('kk-songs-selection').onchange = saveOptions;
	document.getElementById('weather-provider').onchange = displayThirdBox;

	const kkSongsSelect = document.getElementById('kk-songs-selection');
	KKSongList.forEach((song) => {
		const songOption = document.createElement('option');
		songOption.text = song;
		songOption.value = song;
		kkSongsSelect.appendChild(songOption);
	});

	let ctrlCmdText;
	let macCheck;
	// navigator.platform is deprecated; rely on navigator.userAgentData first and foremost...
	// ...but navigator.userAgentData is only supported in Chrome. yay, standards!
	if (navigator.userAgentData) {
		(async () => {
			macCheck = (await navigator.userAgentData.getHighEntropyValues(['platform'])).platform == 'macOS'
		})()
	} else macCheck = navigator.platform == 'MacIntel'
	if (macCheck) ctrlCmdText = 'Command/Cmd'
	else ctrlCmdText = 'Control/Ctrl/Steuerung/Strg'
	document.getElementById('ctrl-cmd').textContent = ctrlCmdText;
}

function displayThirdBox() {
	if (document.getElementById('weather-provider').value == 'owm-proxy') {
		Array.from(document.getElementsByClassName('provider-url')).forEach(element => { element.style = 'display:none;' })
		Array.from(document.getElementsByClassName('api-key')).forEach(element => { element.style = 'display:none;' })
		return;
	}
	else if (document.getElementById('weather-provider').value == 'other') {
		Array.from(document.getElementsByClassName('api-key')).forEach(element => { element.style = 'display:none;' })
		Array.from(document.getElementsByClassName('provider-url')).forEach(element => { element.style = '' });
	}
	else {
		Array.from(document.getElementsByClassName('provider-url')).forEach(element => { element.style = 'display:none;' })
		Array.from(document.getElementsByClassName('api-key')).forEach(element => { element.style = '' })
	}
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
		music,
		weather,
		enableNotifications,
		enableKK,
		alwaysKK,
		kkVersion,
		enableTownTune,
		absoluteTownTune,
		zipCode,
		countryCode,
		enableBadgeText,
		enableBackground,
		tabAudio,
		tabAudioReduceValue,
		kkSelectedSongsEnable,
		kkSelectedSongs
	});
	window.localStorage.setItem("volume", volume)
	window.localStorage.setItem("townTuneVolume", townTuneVolume)
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
		weatherProvider: 'owm-proxy',
		zipCode: "98052",
		countryCode: "us",
		apiKey: '',
		enableBadgeText: true,
		tabAudio: 'pause',
		enableBackground: false,
		tabAudioReduceValue: 80,
		kkSelectedSongsEnable: false,
		kkSelectedSongs: []
	}, items => {
		if (window.localStorage.getItem('volume') == null) {
			window.localStorage.setItem('volume', `${items.volume}`);
		}
		if (window.localStorage.getItem('townTuneVolume') == null) {
			window.localStorage.setItem('townTuneVolume', `${items.townTuneVolume}`);
		}
		items.volume = (window.localStorage.getItem("volume") >= 0 && window.localStorage.getItem("volume") !== null) ? window.localStorage.getItem("volume") : 0.5;
		items.townTuneVolume = (window.localStorage.getItem("townTuneVolume") >= 0 && window.localStorage.getItem("volume") !== null) ? window.localStorage.getItem("townTuneVolume") : 0.75;
		document.getElementById('volume').value = items.volume;
		document.getElementById('volumeText').innerText = `${formatPercentage(items.volume*100)}`;
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
		document.getElementById('townTuneVolumeText').innerText = `${formatPercentage(items.townTuneVolume*100)}`;
		document.getElementById('zip-code').value = items.zipCode;
		document.getElementById('country-code').value = items.countryCode;
		document.getElementById('weather-provider').value = items.weatherProvider;
		document.getElementById('enable-badge').checked = items.enableBadgeText;
		document.getElementById('enable-background').checked = navigator.userAgentData ? items.enableBackground : false;
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

function responseMessage(message = 'An unknown error occurred', success = false) {
	let updateLocationEl = document.getElementById('update-location');
	let weatherResponseEl = document.getElementById('weather-response');

	if (success == true) {
		weatherResponseEl.style.color = "#39d462";
		saveOptions();
	} else weatherResponseEl.style.color = "#d43939";
	weatherResponseEl.textContent = message;

	updateLocationEl.textContent = "Update Location";
	updateLocationEl.disabled = false;
}

async function getPermissions(url) {
	chrome.permissions.contains({ origins: [`*://${new URL(url).hostname}/*`] }, hasPerms => {
		if (hasPerms) {
			console.log('Has permissions!');
			return true;
		}
		else {
			chrome.permissions.request({ origins: [`*://${new URL(url).hostname}/*`] }, hasPerms => {
				if (!(hasPerms)) {
					responseMessage('You must accept the permissions to use that weather provider.');
					throw 'No permissions';
				}
			});
		}
	});
}

let city;
let country;

function validateWeather() {
	let updateLocationEl = document.getElementById('update-location');
	updateLocationEl.textContent = "Validating...";
	updateLocationEl.disabled = true;

	let weatherProvider = document.getElementById('weather-provider').value.trim();
	let providerURL = document.getElementById('provider-url').value.trim();
	let apiKey = document.getElementById('api-key').value.trim();
	let zip = document.getElementById('zip-code').value.trim();
	let countryCode = document.getElementById('country-code').value.trim();
	if (weatherProvider == '') {
		responseMessage('You must specify your weather provider.');
		return;
	}
	if (weatherProvider == 'other' && providerURL == '') {
		responseMessage('You must specify the URL of your weather provider.');
		return;
	}
	if (!((weatherProvider == 'other') || (weatherProvider == 'owm-proxy')) && apiKey == '') {
		responseMessage('You must specify your API key. If you don\'t have one, pick a proxy option.');
		return;
	}
	if (zip == '') {
		responseMessage('You must specify your ZIP / postal code.');
		return;
	}
	if (countryCode == '') {
		responseMessage('You must pick your country.');
		return;
	}

	let noPerms;

	if (noPerms) return;

	let url;
	switch (weatherProvider) {
		case 'owm':
			getPermissions('https://api.openweathermap.org/')
			.then(() => {
				url = `https://api.openweathermap.org/data/2.5/weather?q=${zip},${countryCode}&APPID=${apiKey}`;
				getWeather(url);
			});
			break;
		case 'foreca':
			try {
				let id;
				getPermissions('https://fnw-us.foreca.com/')
				.then(() => {
					fetch(`https://fnw-us.foreca.com/api/v1/location/search/${zip}?country=${countryCode}&token=${apiKey}`)
					.then(response => response.json())
					.then(response => {
						city = response.locations[0].name;
						country = response.locations[0].country;
						id = response.locations[0].id;

						url = `https://fnw-us.foreca.com/api/v1/current/${id}?token=${apiKey}`;
						getWeather(url);
					})
					.catch(error => {
						console.error(error);
						responseMessage('An unknown error occurred', false);
					});
				})
				.catch(error => {
					console.error(error);
					responseMessage('An unknown error occurred', false);
				})
			} catch (error) {
				console.error(error);
				responseMessage('An unknown error occurred', false);
			}
			break;
		case 'foreca-eu':
			try {
				let id;
				getPermissions('https://pfa.foreca.com/')
				.then(() => {
					fetch(`https://pfa.foreca.com/api/v1/location/search/${zip}?country=${countryCode}&token=${apiKey}`)
					.then(response => response.json())
					.then(response => {
						city = response.locations[0].name;
						country = response.locations[0].country;
						id = response.locations[0].id;

						url = `https://pfa.foreca.com/api/v1/current/${id}?token=${apiKey}`;
						getWeather(url);
					})
					.catch(error => {
						console.error(error);
						responseMessage('An unknown error occurred', false);
					});
				})
				.catch(error => {
					console.error(error);
					responseMessage('An unknown error occurred', false);
				})
			} catch (error) {
				console.error(error);
				responseMessage('An unknown error occurred', false);
			}
			break;
		case 'other':
			getPermissions(`${providerURL}`)
			.then(() => {
				fetch(`${new URL(providerURL).protocol}//${new URL(providerURL).host}/api/j-settings`)
				.then(response => response.json())
				.then(response => {
					if (response.weather.enabled) {
						url = `${providerURL}/${countryCode}/${zip}`; 
						getWeather(url);
					} else responseMessage('Weather is not enabled for this J variant server')
				})
				.catch(error => {
					console.error(error);
					responseMessage('Please enter a J variant server URL')
				})
			})
			break;
		default:
			getPermissions('https://acmusicext.com/')
			.then(() => {
				url = `https://acmusicext.com/api/weather-v1/${countryCode}/${zip}`;
				getWeather(url);
			});
			break;
	}
}

function getWeather(url) {
	let weatherProvider = document.getElementById('weather-provider').value.trim();
	let proxy = ((weatherProvider == 'owm-proxy') || (weatherProvider == 'other'));
	let zip = document.getElementById('zip-code').value.trim();
	let weather;

	let request = new XMLHttpRequest();

	request.onload = function () {
		let response;
		try {
			response = JSON.parse(request.responseText);
		} catch (Exception) {
			responseMessage();
			return;
		}

		if (request.status == 200) {
			if (proxy) {
				city = response.city;
				country = response.country;
				weather = response.weather;
			} else switch (weatherProvider) {
				case 'foreca':
					// City and country was handled earlier

					let raining = /rain/i.test(response.weather)
					let snowing = /rain/i.test(response.weather)
					if (raining) weather = "Rain"
					else if (snowing) weather = "Snow"
					else weather = "Clear"

					break;
				case 'owm':
					// City and country
					city = response.name;
					country = response.sys.country;
					weather = response.weather[0].id.toString();

					// Analyzing weather ID to make proper response
					if (weather.startsWith('6')) weather = "Snow"
					else if (weather.startsWith('8')) weather = "Clear"
					else weather = "Rain"

					break;
			}

			responseMessage(`Success! The current weather status in ${city}, ${country} is "${weather}"`, true);
		}
		else {
			if (response.error) {
				if ((response.error === "City not found") && (containsSpace(zip))) {
					response.error += " – Try with only the first part of the ZIP code / postal code."
				}
				responseMessage(response.error);
			}
			else responseMessage();
		}
	}

	request.onerror = () => responseMessage();

	request.open("GET", url, true);
	request.send();
}

function updateChildrenState(disabled, childElement){
	childElement.disabled = disabled
}

// Handles MediaSession (audio metadata) management

'use strict';

function MediaSessionManager() {

	let gameNames = {
		'animal-crossing': 'Animal Crossing',
		'wild-world': 'Animal Crossing: Wild World',
		'new-leaf': 'Animal Crossing: New Leaf',
	}

	this.updateMetadata = async function (game, hour, weather) {
		let artwork = await toDataURL(game);
		navigator.mediaSession.metadata = new MediaMetadata({
			title: `${formatHour(hour)} (${weather.charAt(0).toUpperCase() + weather.slice(1)})`,
			artist: gameNames[game],
			album: 'Animal Crossing Music (Revived)',
			artwork: [
				{ src: artwork, sizes: '512x512', type: 'image/png' }
			]
		});
	}

	this.updateMetadataKK = async function (title, fileName) {
		let metadata = new MediaMetadata({
			title,
			artist: 'K.K. Slider',
			album: 'Animal Crossing Music (Revived)'
		});

		// We try getting our artwork. If we succeed, then we add it to the metadata.
		// If we try to pass a null or blank artwork src, then it throws an error.
		// Also, K.K. albumn art is only available in 128x128px
		let artworkSrc = await toDataURL(fileName, true);
		if (artworkSrc) {
			metadata.artwork = [
				{ src: artworkSrc, sizes: '128x128', type: 'image/png' }
			];
		};

		navigator.mediaSession.metadata = metadata;
	}

	// Gets a blob URL from a local file.
	function toDataURL(name, kk = false) {
		return new Promise(resolve => {
			let xhr = new XMLHttpRequest();
			xhr.open('GET', chrome.extension.getURL(`../img/cover/${kk ? 'kk/' : ''}${name}.png`), true);
			xhr.responseType = 'blob';
			xhr.onload = function () {
				if (this.status == 200) resolve(URL.createObjectURL(this.response));
				else fallback();
			};
			xhr.onerror = fallback;
			xhr.send();

			// Fallback function.
			async function fallback() {
				// Prevent potential infinite loops.
				if (name == 'kk') resolve('');

				if (kk) resolve(`https://ac.pikadude.me/static/kk/art/${name}.png`);
				else resolve(await toDataURL('kk'));
			}
		});
	}
}

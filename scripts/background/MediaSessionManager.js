// Handles MediaSession (audio metadata) management

'use strict';

function MediaSessionManager() {

	let gameNames = {
		'animal-crossing': 'Animal Crossing',
		'wild-world': 'Animal Crossing: Wild World',
		'new-leaf': 'Animal Crossing: New Leaf',
		'new-horizons': 'Animal Crossing: New Horizons'
	}

	// Updates the mediasession metadata (for hourly music)
	this.updateMetadata = async function (game, hour, weather) {
		let artwork = await toDataURL(game);
		navigator.mediaSession.metadata = new MediaMetadata({
			title: `${formatHour(hour)} (${capitalize(weather)})`,
			artist: gameNames[game],
			album: 'Animal Crossing Music',
			artwork: [
				{ src: artwork, sizes: '512x512', type: 'image/png' }
			]
		});
		printDebug('Updated MediaSession (hourly): ', navigator.mediaSession.metadata);
	}

	// Updates the mediasession metadata (for kk)
	this.updateMetadataKK = async function (title, fileName) {
		let metadata = new MediaMetadata({
			title,
			artist: 'K.K. Slider',
			album: 'Animal Crossing Music'
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
		navigator.mediaSession.metadata = metadata
		printDebug('Updated MediaSession (kk): ', navigator.mediaSession.metadata);
	}

	// Gets a blob URL from a local file.
	function toDataURL(name, kk = false) {
		return new Promise(resolve => {
			let imagePath = `../img/cover/${kk ? 'kk/' : ''}${name}.png`
			printDebug(`Trying to retrieve art from local storage: "${imagePath}"`)

			let xhr = new XMLHttpRequest();
			xhr.open('GET', getLocalUrl(imagePath), true);
			xhr.responseType = 'blob';
			xhr.onload = function () {
				printDebug('Successfully created blob url from local image')
				resolve(URL.createObjectURL(this.response));
			};
			xhr.onerror = fallback;
			xhr.send();

			// Fallback function
			async function fallback() {
				printDebug('Could not create blob url from local image')
				
				// Prevent potential infinite loops.
				if (name == 'kk') resolve('');

				if (kk) {
					let kkArtUrl = `https://ac.pikadude.me/static/kk/art/${name}.png`
					printDebug(`Using fallback remote url: "${kkArtUrl}"`)
					resolve(kkArtUrl);
				}
				else {
					let defaultKkArtName = 'kk'
					printDebug(`Try using default kk art: ${defaultKkArtName}`)
					resolve(await toDataURL('defaultKkArtName'));
				} 
			}
		});
	}
}

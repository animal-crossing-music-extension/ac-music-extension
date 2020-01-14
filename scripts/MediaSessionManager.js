// Handles MediaSession (audio metadata) management

'use strict';

function MediaSessionManager() {
	
	let gameNames = {
		'animal-crossing': 'Animal Crossing',
		'wild-world': 'Animal Crossing: Wild World',
		'new-leaf': 'Animal Crossing: New Leaf',
	}
	let gameArtwork = {
		'animal-crossing': 'https://i.imgur.com/dgxbXpm.png',
		'wild-world': 'https://i.imgur.com/U9MW9J7.png',
		'new-leaf': 'https://i.imgur.com/nfpxWtV.png'
	}

	this.updateMetadata = function(game, hour, weather) {
		navigator.mediaSession.metadata = new MediaMetadata({
			title: `${formatHour(hour)} (${weather})`,
			artist: gameNames[game],
			album: 'Animal Crossing Music (Revived)',
			artwork: [
				{ src: gameArtwork[game], sizes: '512x512', type: 'image/png' }
			]
		});
	}
}

// Handles playing town tunes, could potentially be either folded
// into AudioManager, or tune_player instead of making createSampler
// and createTunePlayer globally accessable.

'use strict';

function TownTuneManager() {

	var defaultTune = ["G2", "E3", "-", "G2", "F2", "D3", "-", "B2", "C3", "zZz", "C2", "-", "C2", "-", "-", "zZz"];
	var audioContext = new AudioContext();
	var sampler = createSampler(audioContext);
	var tunePlayer = createTunePlayer(audioContext);

	// Play tune and call doneCB after it's done
	this.playTune = function(doneCB) {
		chrome.storage.sync.get({ townTune: defaultTune }, function(items){
			tunePlayer.playTune(items.townTune, sampler, 100).done(doneCB);
		});
	}

}
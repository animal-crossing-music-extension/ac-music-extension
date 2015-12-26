function TownTuneManager() {

	var defaultTune = ["G2", "E3", "=", "G2", "F2", "D3", "=", "B2", "C3", "-", "C2", "-", "C2", "=", "=", "-"];
	var audioContext = new AudioContext();
	var sampler = createSampler(audioContext);
	var tunePlayer = createTunePlayer(audioContext);

	this.playTune = function(doneCB) {
		chrome.storage.sync.get({ townTune: defaultTune }, function(items){
			tunePlayer.playTune(items.townTune, sampler, 100).done(doneCB);
		});
	}

}
(function(global) {
  var availablePitches = ['_', '-', 'G1', 'A1', 'B1', 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3']
  //values in HZ
  //var frequencies = [null, null, 196, 220, 247, 262, 294, 330, 349, 392, 440, 494, 523, 587, 659]
  var frequencies = [null, null, 392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1046, 1174, 1318]
  var audioCtx = new AudioContext();
  var noteLength = 0.2; //in seconds

  var pitchToFreq = function(pitch) {
    if(typeof pitch == 'number') return pitch;

    index = availablePitches.indexOf(pitch);
    if(index == -1) return null;

    var freq = frequencies[index]
    if(!freq) return null;

    return freq;
  }

  var playBoop = function(pitch) {
    var freq = pitchToFreq(pitch);
    if(freq === null) return;

    var oscillator = audioCtx.createOscillator();
    var filter = audioCtx.createBiquadFilter();
    var gainNode = audioCtx.createGain();

    oscillator.type = 'quare';

    filter.type = 'lowpass';
    filter.frequency.value = Math.sqrt(freq) * 10;
    filter.Q.value = 22;

    gainNode.gain.value = 1.0;

    oscillator.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(audioCtx.destination);

    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + noteLength - 0.1);

    oscillator.frequency.value = freq;
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + noteLength);
  };

  //export
  var tunePlayer = {
    availablePitches: availablePitches,
    playBoop: playBoop
  };
  global.tunePlayer = tunePlayer;
})(window);

/*
var loadBoops = function() {
  var reqListener = function() {
    audioCtx.decodeAudioData(req.response, function(buffer) {
      boopBuffer = buffer;
    });
  }

  var req = new XMLHttpRequest();
  req.responseType = 'arraybuffer';
  req.onload = reqListener;
  req.open("get", chrome.extension.getURL('boops.ogg'), true);
  req.send();
};

var playBoops = function() {
  var source = audioCtx.createBufferSource();
  source.buffer = boopBuffer;
  source.connect(audioCtx.destination);
  source.start(0);
};
*/

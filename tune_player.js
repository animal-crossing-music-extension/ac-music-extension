(function(global) {
  var availablePitches = ['_', '-', 'G1', 'A1', 'B1', 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3']
  //values in HZ
  //var frequencies = [null, null, 196, 220, 247, 262, 294, 330, 349, 392, 440, 494, 523, 587, 659]
  var frequencies = [null, null, 392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1046, 1174, 1318]
  var audioCtx = new AudioContext();
  var noteLength = 0.25; //in seconds
  var tempo = 150.0; // BPM
  var stepDuration;
  var lookahead = 25.0; //in milliseconds
  var currentStep;
  var attack = 0.05;

  var getStepDuration = function() {
    if(stepDuration) return stepDuration;
    stepDuration = 1 / (tempo / 60);
    return stepDuration;
  };

  var pitchToFreq = function(pitch) {
    if(typeof pitch == 'number') return pitch;

    index = availablePitches.indexOf(pitch);
    if(index == -1) return null;

    var freq = frequencies[index]
    if(!freq) return null;

    return freq;
  }

  var playBoop = function(pitch, time) {
    if(time === undefined) time = audioCtx.currentTime;
    var freq = pitchToFreq(pitch);
    if(freq === null) return;

    var oscillator = audioCtx.createOscillator();
    var filter = audioCtx.createBiquadFilter();
    var gain = audioCtx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = Math.sqrt(freq) * 12;
    filter.Q.value = 1;

    gain.gain.value = 0;

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);


    oscillator.start(time);
    oscillator.stop(time + noteLength);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(1, time + attack);
    gain.gain.linearRampToValueAtTime(0, time + noteLength);
  };

  var playTune = function(tune) {
    var i, pitch, time;
    for(i in tune) {
      pitch = tune[i];
      time = audioCtx.currentTime + (getStepDuration() * i);
      playBoop(pitch, time);
    }
  };

  //export
  var tunePlayer = {
    availablePitches: availablePitches,
    playBoop: playBoop,
    playTune: playTune
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

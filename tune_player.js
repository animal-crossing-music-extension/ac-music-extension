(function() {
var availablePitches = ['-', '=', 'G1', 'A1', 'B1', 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3'];
//values in HZ
var frequencies = [null, null, 392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1046, 1174, 1318];
var audioCtx = new AudioContext();
var tempo = 240.0; // BPM
var stepDuration;

var attack = 0.05; //in seconds
var decay = 0.1; //in seconds
var release = 0.15; //in seconds
var gainLevel = 3;
var sustainLevel = 2;
var cutoffModifier = 8;
var Q = 0;

var rest = availablePitches[0];
var sustain = availablePitches[1];

var getStepDuration = function() {
  if(stepDuration) return stepDuration;
  stepDuration = 1 / (tempo / 60);
  return stepDuration;
};

var getSustainMultiplier = function(index, tune) {
  var current;
  var count = -1;
  do {
    count += 1;
    index += 1;
    current = tune[index];
  } while(current == sustain)
  return count;
};

var pitchToFreq = function(pitch) {
  if(typeof pitch == 'number') return pitch;

  index = availablePitches.indexOf(pitch);
  if(index == -1) return null;

  var freq = frequencies[index]
  if(!freq) return null;

  return freq;
}

var playBoop = function(pitch, time, sustainDuration) {
  if(time === undefined) time = audioCtx.currentTime;
  if(sustainDuration === undefined) sustainDuration = 0;

  var freq = pitchToFreq(pitch);
  if(freq === null) return;

  var oscillator, filter, gain;

  oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.value = freq;

  filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  //filter tracks the note being played
  filter.frequency.value = Math.sqrt(freq) * cutoffModifier;
  filter.Q.value = Q;

  gain = audioCtx.createGain();
  gain.gain.value = 0;

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.start(time);
  oscillator.stop(time + attack + decay + sustainDuration + release);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(gainLevel, time + attack);
  gain.gain.linearRampToValueAtTime(sustainLevel, time + attack + decay);
  gain.gain.setValueAtTime(sustainLevel, time + attack + decay + sustainDuration);
  gain.gain.linearRampToValueAtTime(0, time + attack + decay + sustainDuration + release);
};

var playTune = function(tune) {
  var callbacks, i, pitch, time, sustainDuration;
  var stepDuration = getStepDuration();
  var eachNote = function(index, duration) {};

  for (i = 0; i < tune.length; i++) {
    time = stepDuration * i;

    //when a note is played
    (function(index) {
      setTimeout(function(){
        eachNote(index, stepDuration);
      }, time * 1000);
    })(i);

    pitch = tune[i];
    if(pitch == rest || pitch == sustain) continue;

    sustainDuration = getSustainMultiplier(i, tune) * stepDuration;
    playBoop(pitch, audioCtx.currentTime + time, sustainDuration);
  }

  //jQuery stlye chain callbacks
  callbacks = {
    eachNote: function(callback) {
      eachNote = callback;
      return callbacks;
    },
    done: function(callback) {
      //when the tune over
      setTimeout(callback, stepDuration * tune.length * 1000);
      return callbacks;
    }
  };
  return callbacks;
};

//export
var tunePlayer = {
  availablePitches: availablePitches,
  playBoop: playBoop,
  playTune: playTune
};
window.tunePlayer = tunePlayer;
})();

/*
This stuff will be useful for the bells;
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

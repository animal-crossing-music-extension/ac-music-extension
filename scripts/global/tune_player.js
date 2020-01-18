(function() {
  var availablePitches = ['zZz', '-', 'G1', 'A1', 'B1', 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3'];


var createBooper = function(audioContext) {
  //values in HZ
  var frequencies = [null, null, 392, 440, 494, 523, 587, 659, 698, 784, 880, 988, 1046, 1174, 1318];

  var attack = 0.05; //in seconds
  var decay = 0.1; //in seconds
  var release = 0.15; //in seconds
  var gainLevel = 3;
  var sustainLevel = 2;
  var cutoffModifier = 8;
  var Q = 0;

  var pitchToFreq = function(pitch) {
    if (typeof pitch == 'number') return pitch;

    index = availablePitches.indexOf(pitch);
    if (index == -1) return null;

    var freq = frequencies[index]
    if (!freq) return null;

    return freq;
  };

  var playNote = function(pitch, time, sustainDuration) {
    if (time === undefined) time = audioContext.currentTime;
    if (sustainDuration === undefined) sustainDuration = 0;

    var freq = pitchToFreq(pitch);
    if (!freq) return;

    var oscillator, filter, gain;

    oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = freq;

    filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    //filter tracks the note being played
    filter.frequency.value = Math.sqrt(freq) * cutoffModifier;
    filter.Q.value = Q;

    gain = audioContext.createGain();
    gain.gain.value = 0;

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(time);
    oscillator.stop(time + attack + decay + sustainDuration + release);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(gainLevel, time + attack);
    gain.gain.linearRampToValueAtTime(sustainLevel, time + attack + decay);
    gain.gain.setValueAtTime(sustainLevel, time + attack + decay + sustainDuration);
    gain.gain.linearRampToValueAtTime(0, time + attack + decay + sustainDuration + release);
  };

  return {
    playNote: playNote
  }
};


var createSampler = function(audioContext) {
  var bellBuffer;
  var startPoints = [null, null];
  var chimeLength = 3.8;
  var volume = 0.2;

  var pitchToStartPoint = function(pitch) {
    index = availablePitches.indexOf(pitch);
    if (index == -1) return null;

    var startPoint = startPoints[index]
    if (!startPoint) return null;

    return startPoint;
  };

  var loadBells = function() {
    var reqListener = function() {
      audioContext.decodeAudioData(req.response, function(buffer) {
        bellBuffer = buffer;
      });
    };

    var req = new XMLHttpRequest();
    req.responseType = 'arraybuffer';
    req.onload = reqListener;
    req.open("get", chrome.extension.getURL('../sound/bells.ogg'), true);
    req.send();
  };

  var initStartPoints = function() {
    for (var i = 0; i < availablePitches.length - 2; i++) {
      startPoints.push(i * 4);
    }
  };

  var playNote = function(pitch, time, sustain) {
    if (!bellBuffer) return;
    var source = audioContext.createBufferSource();
    source.buffer = bellBuffer;

    gain = audioContext.createGain();
    gain.gain.value = volume;

    source.connect(gain);
    gain.connect(audioContext.destination);
    source.start(time, pitchToStartPoint(pitch), chimeLength);
  };

  initStartPoints();
  loadBells();

  return {
    playNote: playNote
  }
};


var createTunePlayer = function(audioContext, bpm) {
  var defaultBpm = 240.0; // BPM
  var stepDuration;

  var rest = availablePitches[0];
  var sustain = availablePitches[1];

  var getStepDuration = function(bpm) {
    if(stepDuration) return stepDuration;
    stepDuration = 1 / (bpm / 60);
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

  var playTune = function(tune, instrument, bpm) {
    var callbacks, i, pitch, time, sustainDuration;
    var stepDuration = getStepDuration(bpm);
    var eachNote = function(index, duration) {};
    if(!bpm) bpm = defaultBpm;

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
      instrument.playNote(pitch, audioContext.currentTime + time, sustainDuration);
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

  return tunePlayer = {
    availablePitches: availablePitches,
    playTune: playTune
  };
};

window.createBooper = createBooper;
window.createSampler = createSampler;
window.createTunePlayer = createTunePlayer;

})();

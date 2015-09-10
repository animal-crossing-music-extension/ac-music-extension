(function(){
var availablePitches = tunePlayer.availablePitches;
var rest = availablePitches[0];
var tuneLength = 16;
var pitchTemplate, staff1, staff2, tune;

var createPitchControl = function(index) {
  var pitch = pitchTemplate.cloneNode(true);
  var name = pitch.querySelector('.pitch-name');
  var slider = pitch.querySelector('.pitch-slider');

  pitch.className = 'pitch';
  pitch.id = 'pitch' + index;

  name.value = tune[index];

  name.onchange = function() {
    var val = name.value.toUpperCase();
    var pitchIndex = availablePitches.indexOf(val);
    if(pitchIndex != -1) {
      slider.value = pitchIndex;
      name.value = val;
    } else {
      slider.value = 0;
      name.value = rest;
      val = rest;
    }
    updateTune(index, val);
  };

  slider.value = availablePitches.indexOf(tune[index]);

  slider.oninput = function() {
    var val = slider.value;
    name.value = availablePitches[val];
    updateTune(index, availablePitches[val]);
  };

  return pitch;
};

var initTune = function() {
  tune = [];
  for(var i = 0; i < tuneLength; i++) tune.push(rest);
};

var initControls = function() {
  var index, newPitchControl, staff, playButton;

  for (index = 0; index < tuneLength; index++) {
    newPitchControl = createPitchControl(index);
    staff = (index < tuneLength/2) ? staff1 : staff2;
    staff.appendChild(newPitchControl);
  }
  
  var playButton = document.querySelector('.play');
  playButton.onclick = function() {
    tunePlayer.playTune(tune);
  };
}

var setup = function() {
  pitchTemplate = document.querySelector('.pitch-template');
  staff1 = document.querySelector('.staff1');
  staff2 = document.querySelector('.staff2');

  initTune();
  initControls();
};

var updateTune = function(index, pitch) {
  tune[index] = pitch;
  tunePlayer.playBoop(pitch);
};

window.addEventListener('load', setup);

})();


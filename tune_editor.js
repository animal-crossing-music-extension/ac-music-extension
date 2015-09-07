(function(){

var availablePitches = ['_', '-', 'G0', 'A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'A2', 'B2', 'C2', 'D2', 'E2']
var tuneLength = 16;
var staff1, staff2, pitchTemplate, tune;

var setup = function() {
  var index, newPitchControl, staff;

  pitchTemplate = document.querySelector('.pitch-template');
  staff1 = document.querySelector('.staff1');
  staff2 = document.querySelector('.staff2');

  initTune();

  for (index = 0; index < tuneLength; index++) {
    newPitchControl = createPitchControl(index);
    staff = (index < tuneLength/2) ? staff1 : staff2;
    staff.appendChild(newPitchControl);
  }
};

var createPitchControl = function(index) {
  var pitch = pitchTemplate.cloneNode(true);
  var name = pitch.querySelector('.pitch-name');
  var slider = pitch.querySelector('.pitch-slider');
  var rest = availablePitches[0];

  pitch.className = 'pitch';
  pitch.id = 'pitch' + index;

  name.value = rest;

  name.onchange = function() {
    var val = name.value.toUpperCase();
    var pitchIndex = availablePitches.indexOf(val);
    if(pitchIndex != -1) {
      slider.value = pitchIndex;
      name.value = val;
      updateTune(index, val);
    } else {
      slider.value = 0;
      name.value = rest;
      updateTune(index, rest);
    }
  };

  slider.value = 0;

  slider.oninput = function() {
    var val = slider.value;
    name.value = availablePitches[val];
    updateTune(index, val);
  };

  return pitch;
};

var initTune = function() {
  tune = [];
  for(var i = 0; i < tuneLength; i++) {
    tune.push(availablePitches[0]);
  }
};

var updateTune = function(index, pitch) {
  tune[index] = pitch;
};

window.addEventListener('load', setup)

})();

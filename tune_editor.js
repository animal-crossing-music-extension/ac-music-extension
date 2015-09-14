(function(){
var pitchTemplate, playButton, saveButton, tune;
var defaultTune = ["G2", "E3", "=", "G2", "F2", "D3", "=", "B2", "C3", "-", "C2", "-", "C2", "=", "=", "-"];
var tuneLength = 16;
var editorControls = [];
var pitchNames = [];
var flashColor = '#FFBC70';
var audioContext = new AudioContext;
var booper = createBooper(audioContext);
var sampler = createSampler(audioContext);
var tunePlayer = createTunePlayer(audioContext);
var availablePitches = tunePlayer.availablePitches;
var rest = availablePitches[0];

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
    if (pitchIndex != -1) {
      slider.value = pitchIndex;
      name.value = val;
    } else {
      slider.value = 0;
      name.value = rest;
      val = rest;
    }
    updateTune(index, val);
    saveButton.textContent = 'Save';
  };

  slider.value = availablePitches.indexOf(tune[index]);

  slider.oninput = function() {
    var val = slider.value;
    name.value = availablePitches[val];
    updateTune(index, availablePitches[val]);
    saveButton.textContent = 'Save';
  };

  pitchNames.push(name);
  editorControls.push(name, slider);

  return pitch;
};

var initControls = function() {
  var index, newPitchControl, staff;

  var staff1 = document.querySelector('.staff1');
  var staff2 = document.querySelector('.staff2');
  pitchTemplate = document.querySelector('.pitch-template');
  playButton = document.querySelector('.play-tune');
  saveButton = document.querySelector('.save-tune');

  for (index = 0; index < tuneLength; index++) {
    newPitchControl = createPitchControl(index);
    staff = (index < tuneLength/2) ? staff1 : staff2;
    staff.appendChild(newPitchControl);
  }

  playButton.onclick = playTune;
  saveButton.onclick = saveTune;

  editorControls.push(playButton);
};

var disableEditor = function() {
  playButton.textContent = 'Playing!';
  for (var i in editorControls) {
    editorControls[i].disabled = true;
  }
};

var enableEditor = function() {
  playButton.textContent = 'Play!';
  for (var i in editorControls) {
    editorControls[i].disabled = false;
  }
};

var flashName = function(index, duration) {
  var pitchName = pitchNames[index];
  pitchName.style.background = flashColor;

  setTimeout(function() {
    pitchName.style.background = '#fff';
  }, duration * 1000);
};

var playTune = function() {
  disableEditor();
  tunePlayer.playTune(tune, booper, 240).eachNote(flashName).done(enableEditor);
};

var retrieveTune = function(done) {
  chrome.storage.sync.get({ townTune: defaultTune }, function(items){
    tune = items.townTune;
    if (typeof done == 'function') done();
  });
};

var saveTune = function() {
  chrome.storage.sync.set({ townTune: tune }, function(){
    saveButton.textContent = 'Saving...';
    saveButton.disabled = true;
    setTimeout(function() {
      saveButton.textContent = 'Saved';
      saveButton.disabled = false;
    }, 750);
  });
};

var setup = function() {
  retrieveTune(initControls);
};

var updateTune = function(index, pitch) {
  tune[index] = pitch;
  booper.playNote(pitch);
};

window.addEventListener('load', setup);
})();


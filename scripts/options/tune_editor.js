$(function(){
var pitchTemplate, playButton, saveButton, tune;
const defaultTune = ["C2", "E2", "C2", "G1", "F1", "G1", "B1", "D2", "C2", "zZz", "G1", "zZz", "C2", "-", "-", "zZz"]; // From AC : Wild World. Old default: ["G2", "E3", "-", "G2", "F2", "D3", "-", "B2", "C3", "zZz", "C2", "zZz", "C2", "-", "-", "zZz"];
var tuneLength = 16;
var availableColors = ["#a4a2d0", "#e4b3d3", "#5eccf5", "#12fee0", "#53fd8a", "#79fc4e", "#a8fd35", "#d0fe47", "#e4fd39", 
                       "#f9fe2e", "#fefa43", "#fef03f", "#fcd03a", "#fcb141", "#fe912e", "#FE672E", "#FA5C90", "#ba32a4"];
var editorControls = [];
var pitchNames = [];
var flashColor = '#FFFFFF';
var audioContext = new AudioContext;

var booper     = createBooper(audioContext);  // Instrument for the town tune editor
var sampler    = createSampler(audioContext); // Instrument for the town tune playing at the hour
var tunePlayer = createTunePlayer(audioContext); // Responsible for playing town tunes
var availablePitches = tunePlayer.availablePitches;
var rest = availablePitches[0];

var defaultTownTuneVolume = 0.75; // Fallback town tune volume, change this if the default town tune volume is altered.

$(".pitch-template > .pitch-slider")[0].max = availablePitches.length-1;

var createPitchControl = function(index) {
  var pitch = pitchTemplate.cloneNode(true);
  var name = pitch.querySelector('.pitch-name');
  var slider = pitch.querySelector('.pitch-slider');

  pitch.className = 'pitch';
  pitch.id = 'pitch' + index;

  name.value = tune[index];
  name.style.borderColor = "transparent";
  
  
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
	  updateColor(index, tune[index]);
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
  resetButton = document.querySelector('.reset-tune');
  randomizeButton = document.querySelector('.randomize-tune');
  saveButton = document.querySelector('.save-tune');
  let volumeSlider = document.getElementById("townTuneVolume");

  for (index = 0; index < tuneLength; index++) {
    newPitchControl = createPitchControl(index);
    staff = (index < tuneLength/2) ? staff1 : staff2;
    staff.appendChild(newPitchControl);
	  updateColor(index, tune[index]);
  }

  playButton.onclick  = playTune;
  resetButton.onclick = resetTune;
  randomizeButton.onclick = randomizeTune;
  saveButton.onclick = function(){
    saveTune();
    saveOptions();
  }

  editorControls.push(playButton);
  editorControls.push(resetButton);
  editorControls.push(randomizeButton);
  editorControls.push(volumeSlider);
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
  pitchName.style.borderColor = availableColors[availablePitches.indexOf(tune[index])];
  let pitch = pitchName.value;
  
  if (pitch == '-'){
    pitchName.style.transform = "scale(1.1) translate(-3px, 0) rotate(-15deg)";
  } else 
  if(pitch != "zZz") {
    pitchName.style.transform = "scale(1.25) rotate(10deg)";
  }
  
  setTimeout(function() {
    updateColor(index, tune[index]);
    pitchName.style.borderColor = "transparent";
    pitchName.style.transform = "initial";
  }, duration * 1000);
};

/**
 * @method playTune
 * @desc   Plays the town tune using createBooper as an instrument, used only by the town tune editor
 */
var playTune = function() {
  chrome.storage.sync.get({townTuneVolume: defaultTownTuneVolume}, function(items){
    disableEditor();
    tunePlayer.playTune(tune, booper, 240, items.townTuneVolume).eachNote(flashName).done(enableEditor);
  });
};

var resetTune = function() {
  tune = Array.from(defaultTune);
  let tuneSliders = document.getElementsByClassName("pitch");
  
  // Setting sliders
  for (let i = 0; i < tuneLength; i++) {
    let range = tuneSliders[i].getElementsByClassName("pitch-slider")[0]; 
    let label = tuneSliders[i].getElementsByClassName("pitch-name")[0];
    label.value = tune[i];  
    range.value = availablePitches.indexOf(tune[i]); 
	  updateColor(i,tune[i]);
  }
}

var randomizeTune = function(){
  let tuneSliders = document.getElementsByClassName("pitch");
  
  // Randomizing sliders
  for (let i = 0; i < tuneLength; i++) {
    // Selecting a random pitch
    let pitch =  availablePitches[ 2 + Math.floor( Math.random() * availablePitches.length-2 ) ];
    tune[i] = pitch;
    
    // Setting values
    let range = tuneSliders[i].getElementsByClassName("pitch-slider")[0]; 
    let label = tuneSliders[i].getElementsByClassName("pitch-name")[0];
    label.value = tune[i];  
    range.value = availablePitches.indexOf(tune[i]); 
	  updateColor(i,tune[i]);
  }
}

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
      saveButton.textContent = 'Saved!';
      saveButton.disabled = false;
      setTimeout(function() {
        saveButton.textContent = 'Save';
      }, 2000);
    }, 750);
  });
};

var setup = function() {
  retrieveTune(initControls);
};

var updateColor = function(index, pitch){
  var pitchName = pitchNames[index];
  pitchName.style.background = availableColors[availablePitches.indexOf(pitch)];
} 

var updateTune = function(index, pitch) {
  tune[index] = pitch;
  booper.playNote(pitch);
};

window.addEventListener('load', setup);
}) //();
// changed execution of tune_editor.js by adding the jQuery document-ready method to the start (https://learn.jquery.com/using-jquery-core/document-ready/)
// (=> This files' content waits until the page is finished loading before it runs)
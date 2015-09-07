'use strict';

function saveOptions() {
  var volume = document.getElementById('volume').value;
  var music;
  var enableNotifications = document.getElementById('enable-notifications').checked;
  var enableKK = document.getElementById('enable-kk').checked;
  
  if (document.getElementById('animal-forrest').checked) {
    music = 'animal-forrest';
  }
  else if (document.getElementById('wild-world').checked) {
    music = 'wild-world';
  }
  else if (document.getElementById('city-folk-snowing').checked) {
    music = 'city-folk-snowing';
  }
  else if (document.getElementById('new-leaf').checked) {
    music = 'new-leaf';
  }
  else if (document.getElementById('new-leaf-snowing').checked) {
    music = 'new-leaf-snowing';
  }
  else if (document.getElementById('new-leaf-raining').checked) {
    music = 'new-leaf-raining';
  }
  
  chrome.storage.sync.set({
    volume: volume,
    music: music,
    enableNotifications: enableNotifications,
    enableKK: enableKK
  }, function() {
    var save = document.getElementById('save');
    save.textContent = 'Saving...';
    save.disabled = true;
    setTimeout(function() {
      save.textContent = 'Saved';
      save.disabled = false;
    }, 750);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    volume: 0.5,
    music: 'new-leaf',
    enableNotifications: true,
    enableKK: true
  }, function(items) {
    document.getElementById('volume').value = items.volume;
    document.getElementById(items.music).checked = true;
    document.getElementById('enable-notifications').checked = items.enableNotifications;
    document.getElementById('enable-kk').checked = items.enableKK;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').onclick = saveOptions;

// About/Help

document.getElementById('get-help').onclick = function() {		
  window.open('https://github.com/JdotCarver/Animal-Crossing-Music-Extension/issues');		
};
document.getElementById('report-an-issue').onclick = function() {
  window.open('https://github.com/JdotCarver/Animal-Crossing-Music-Extension/issues');
};

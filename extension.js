'use strict';

var options, audio, audioContext, defaultTune, currentTime, currentMusic, badgeText, day, time,
  checkVolume, sampler, setAudioUrl, switchMusic, tunePlayer, formatText, updateText, updateTime, init;

audio = document.createElement('audio');
audio.loop = true;

defaultTune = ["G2", "E3", "=", "G2", "F2", "D3", "=", "B2", "C3", "-", "C2", "-", "C2", "=", "=", "-"];
audioContext = new AudioContext();
sampler = createSampler(audioContext);
tunePlayer = createTunePlayer(audioContext);

day = new Date().getDay();
time = new Date().getHours();
currentTime = new Date().getHours();

function getSyncedOptions (callback) {
  chrome.storage.sync.get({
    volume: 0.5,
    music: 'new-leaf',
    enableNotifications: true,
    enableKK: true,
    enableTownTune: true
  }, function(items) {
    options = items;

    if (typeof callback === 'function') {
      callback();
    }
    else {
      init();
    }
  });
}

function getTownTune(done) {
  chrome.storage.sync.get({ townTune: defaultTune }, function(items){
    if (typeof done == 'function') done(items.townTune);
  });
}

function checkVolume () {
  audio.volume = options.volume;
}

function setAudioUrl (file, day) {
  var time = new Date().getHours();
  
  // If today is Saturday at 8pm, play songs from the kk folder (if enabled).
  if (day === 6 && time === 18 && options.enableKK) {
    currentMusic = 'kk';
  }
  else {
    currentMusic = options.music;
  }
  audio.src = '../' + currentMusic + '/' + file + '.ogg';
}

function switchMusic (time, day) {
  var day = new Date().getDay(),
    time = new Date().getHours(),
    notificationOptions = {
      type: 'basic',
      title: 'Animal Crossing Music',
      message: 'It is now ' + formatText(time,day) + '!',
      iconUrl: 'clock.png'
    };
  
  if (options.enableNotifications) {
    if (day === 6 && time === 18 && options.enableKK) {
      notificationOptions.message = 'K.K. Slider has started to play!';
      chrome.notifications.create('animal-crossing-music-kk', notificationOptions, function(id) {
        // Creation callback.
      });
    }
    else {
      chrome.notifications.create('animal-crossing-music', notificationOptions, function(id) {
        // Creation callback.
      });
    }
  }
  
  updateText(time, day);
  
  // If the day is Saturday, a random K.K. Slider song is chosen to play (if enabled).
  if (day === 6 && time === 18 && options.enableKK) {
    setAudioUrl((Math.floor((Math.random() * 36) + 1).toString()), day);
  }
  else {
    setAudioUrl(formatText(time, day));
  }
}

// Determines the overlay text on the Extension Icon.
function formatText (time, day) {
  // If today is Saturday at 8pm, show the user they are listening to KK music (if enabled.)
  if (day === 6 && time === 18 && options.enableKK) {
    return 'KK time';
  }
  if (time === -1) {
    return '';
  }
  else if (time === 0) {
    return '12am';
  }
  else if (time === 12) {
    return '12pm';
  }
  else if (time < 13) {
    return time + 'am';
  }
  else {
    return time - 12 + 'pm';
  }
}

// Updates the Extension Icon's overlay text.
function updateText (time, day, show) {
  badgeText = formatText(time,day);
  chrome.browserAction.setBadgeText({ text: badgeText.replace('m', '') });
}

function updateTime () {
  var time = new Date().getHours();

  if(!audio.paused) {
    // New hour! New music and new text.
    if (time != currentTime) {
      currentMusic = options.music;
      if(options.enableTownTune) {
        //play the town tune before starting the new song
        getTownTune(function(tune) {
          audio.pause();
          tunePlayer.playTune(tune, sampler, 100).done(function() {
            switchMusic(time, day);
            audio.play();
          });
        });
      } else {
        switchMusic(time, day);
        audio.play();
      }
      updateText(time,day);
      currentTime = time;
    } else if (currentMusic !== options.music) {
      switchMusic(time, day);
      audio.play();
    }
  }
}

// Set the globe spinning.
function init () {
  if (typeof options === 'undefined') {
    getSyncedOptions();
  }
  
  var day = new Date().getDay();
  checkVolume();
  switchMusic(currentTime);
  updateText(currentTime, day, false);
  updateTime();
  
  // K.K songs are long, so a different update timer must be used to avoid mid-song interruption from Math.random generation.
  if (day === 6 && time === 18 && options.enableKK) {
    setInterval(updateTime, 240000);
  }
  else {
    setInterval(updateTime, 60000);
  }
  
  chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });
}

chrome.browserAction.onClicked.addListener(function() {
  var callback = function() {
    checkVolume();
    if (audio.paused) {
      audio.play();
      updateTime();
      updateText(currentTime, day);
    }
    else {
      audio.pause();
      updateText(-1, day);
    }
  };
  
  getSyncedOptions(callback);
});

getSyncedOptions();

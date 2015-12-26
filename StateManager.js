function StateManager() {

	var self = this;

	var options = {};
	var callbacks = {};

	var timeKeeper = new TimeKeeper();
	var isKKTime = timeKeeper.getDay() == 6 && timeKeeper.getHours() >= 20;

	this.registerCallback = function(event, callback) {
		callbacks[event] = callbacks[event] || [];
		callbacks[event].push(callback);
	};

	this.getOption = function(option) {
		return options[option];
	};

	this.activate = function() {
		getSyncedOptions(function() {
			notifyListeners("volume", [options.volume]);
			if(isKK()) {
				notifyListeners("KKStart");
			} else {
				notifyListeners("hourMusic", [timeKeeper.getHour(), options.music, false]);
			}
		});
	};

	function notifyListeners(event, args) {
		if(!options.paused) {
			var callbackArr = callbacks[event] || [];
			for(var i = 0; i < callbackArr.length; i++) {
				callbackArr[i].apply(window, args);
			}
		}
	}

	function isKK() {
		return options.alwaysKK || (options.enableKK && isKKTime);
	}

	// retrieve saved options
	function getSyncedOptions(callback) {
		chrome.storage.sync.get({
			volume: 0.5,
			music: 'new-leaf',
			enableNotifications: true,
			enableKK: true,
			alwaysKK: false,
			paused: false,
			enableTownTune: true
		}, function(items) {
			options = items;
			if (typeof callback === 'function') {
				callback();
			}
		});
	}

	timeKeeper.registerHourlyCallback(function(day, hour) {
		if(!isKK()) {
			notifyListeners("hourMusic", [hour, options.music, true]);
		}
	});

	timeKeeper.registerSpecificTimeCallback(function(day, hour) {
		var wasKK = isKK();
		isKKTime = true;
		if(isKK() && !wasKK) {
			notifyListeners("KKStart");
		}
	}, 6, 20);

	timeKeeper.registerSpecificTimeCallback(function(day, hour) {
		var wasKK = isKK();
		isKKTime = false;
		if(!isKK() && wasKK) {
			notifyListeners("hourMusic", [hour, options.music]);
		}
	}, 0, 0);

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		var wasKK = isKK();
		getSyncedOptions(function() {
			if(typeof changes.volume !== 'undefined') {
				notifyListeners("volume", [options.volume]);
			}
			if(typeof changes.music !== 'undefined' && !isKK()) {
				notifyListeners("game", [timeKeeper.getHour(), options.music]);
			}
			if(isKK() && !wasKK) {
				notifyListeners("KKStart");
			}
			if(!isKK() && wasKK) {
				notifyListeners("hourMusic", [timeKeeper.getHour(), options.music]);
			}
		});
	});

	// play/pause when user clicks the extension icon
	chrome.browserAction.onClicked.addListener(function() {
		
		chrome.storage.sync.set({
			paused: !options.paused
		}, function() {
			if(options.paused) {
				self.activate();
			} else {
				notifyListeners("pause");
				options.paused = true;
			}
		});
	});

}
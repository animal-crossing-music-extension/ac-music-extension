'use strict';

(function() {
	
	var stateManager = new StateManager();
	var audioManager = new AudioManager(stateManager.registerCallback, function() {
		return stateManager.getOption("enableTownTune");
	});
	var notificationManager = new NotificationManager(stateManager.registerCallback, function() {
		return stateManager.getOption("enableNotifications");
	});
	var badgeManager = new BadgeManager(stateManager.registerCallback, function() {
		return stateManager.getOption("enableBadgeText");
	});
	
	stateManager.activate();
	
})();
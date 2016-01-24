'use strict';

(function() {
	
	var stateManager = new StateManager();
	var audioManager = new AudioManager(stateManager.registerCallback, function() {
		return stateManager.getOption("enableTownTune");
	});
	var notificationManager = new NotificationManager(stateManager.registerCallback, function() {
		return stateManager.getOption("enableNotifications");
	});
<<<<<<< HEAD
	var badgeManager = new BadgeManager(stateManager.registerCallback, function() {
		return stateManager.getOption("enableBadgeText");
	});
	
	stateManager.activate();
	
})();
=======
	var badgeManager = new BadgeManager(stateManager.registerCallback);
	
	stateManager.activate();
	
})();
>>>>>>> refs/remotes/JdotCarver/master

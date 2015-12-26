var stateManager = new StateManager();
var audioManager = new AudioManager(stateManager.registerCallback, function() {
	return stateManager.getOption("enableTownTune");
});
var notificationManager = new NotificationManager(stateManager.registerCallback, function() {
	return stateManager.getOption("enableNotifications");
});
setTimeout(function() {
	stateManager.activate();
}, 10);

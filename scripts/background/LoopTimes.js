// So long as there is either no object
// loopTimes[thisGame][thisHour][thisWeather], when the extension
// plays music for game "thisGame", hour "thisHour" and weather "thisWeather"
// it will loop using these manually set times.

// If you add a new game to loopTimes, you don't need
// to add all 24 sets of times at once. If you only add a few,
// it won't introduce any bugs with the other hour tracks.

const loopTimes = {
}
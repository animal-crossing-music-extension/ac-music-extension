// So long as there is either no object
// loopTimes[thisGame][thisHour], when the extension
// plays music for game "thisGame" and hour "thisHour",
// it will loop using the old behavior.

// If you add a new game to loopTimes, you don't need
// to add all 24 sets of times at once. If you only add a few,
// it won't introduce any bugs with the other hour tracks.

var loopTimes = {
	"animal-crossing" : {
		17 : {
			start : 54.934,
			end : 114.943
		}
	},
	"wild-world" : {
		0 : {
			start : 12.290,
			end : 61.514 
		},
		1 : {
			start : 12.789,
			end : 103.654
		},
		2 : {
			start : 23.529,
			end : 92.013
		},
		3 : {
			start : 26.777,
			end : 66.801
		},
		4 : {
			start : 6.893,
			end : 53.719
		},
		5 : {
			start :18.335,
			end : 92.185
		},
		6 : {
			start : 12.481,
			end : 51.668
		},
		7 : {
			start : 4.549,
			end : 44.543
		},
		8 : {
			start : 6.625,
			end : 33.307
		},
		9 : {
			start : 15.648,
			end : 51.653
		},
		10 : {
			start : 21.807,
			end : 60.736
		},
		11 : {
			start : 29.210,
			end : 80.264
		},
		12 : {
			start : 16.336,
			end : 101.667
		},
		13 : {
			start : 15.343,
			end : 63.346
		},
		14 : {
			start : 22.163,
			end : 75.500
		},
		15 : {
			start : 19.831,
			end : 56.449
		},
		16 : {
			start : 9.838,
			end : 101.774
		},
		17 : {
			start : 6.489,
			end : 46.501
		},
		18 : {
			start : 12.258,
			end : 66.265
		},
		19 : {
			start : 19.880,
			end : 64.847
		},
		20 : {
			start : 14.153,
			end : 44.922
		},
		21 : {
			start : 6.695,
			end : 54.683
		},
		22 : {
			start : 51.694,
			end : 142.478
		},
		23 : {
			start : 50.561,
			end : 126.332
		}
	}
}
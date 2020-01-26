// These are the times that a song will begin and end it's loop.
// Stored as [game][weather][hour]
// Once the song begins, it will play from the beginning of the song (0s) until the
// "end" time. Once it reaches the "end" time, will then jump back to the "start" time.
// If a loop time is not specified, it will default to looping the entire song.

const loopTimes = {
	"animal-crossing": {
		sunny: {
			0: {
				start: 0.000,
				end: 125.628
			},
			1: {
				start: 3.925,
				end: 133.740
			},
			2: {
				start: 0.000,
				end: 175.674
			},
			3: {
				start: 0.416,
				end: 177.770
			},
			4: {
				start: 0.000,
				end: 138.628
			},
			5: {
				start: 0.000,
				end: 186.119,
			},
			6: {
				start: 0.396,
				end: 165.777,
			},
			7: {
				start: 0.000,
				end: 137.524,
			},
			8: {
				start: 0.000,
				end: 142.308,
			},
			9: {
				start: 2.700,
				end: 130.613,
			},
			10: {
				start: 0.000,
				end: 116.657,
			},
			11: {
				start: 0.000,
				end: 142.220,
			},
			12: {
				start: 0.000,
				end: 109.480,
			},
			13: {
				start: 0.000,
				end: 144.945,
			},
			14: {
				start: 0.000,
				end: 130.274,
			},
			15: {
				start: 0.940,
				end: 82.985,
			},
			16: {
				start: 0.000,
				end: 130.280,
			},
			17: {
				start: 10.460,
				end: 136.090,
			},
			18: {
				start: 0.000,
				end: 134.920,
			},
			19: {
				start: 0.000,
				end: 127.740,
			},
			20: {
				start: 0.000,
				end: 120.780,
			},
			21: {
				start: 0.000,
				end: 153.528,
			},
			22: {
				start: 1.240,
				end: 101.750,
			},
			23: {
				start: 0.000,
				end: 80.386,
			}
		},
		snowing: {
			0: {
				start: 0.000,
				end: 125.628
			},
			1: {
				start: 3.925,
				end: 133.740
			},
			2: {
				start: 0.000,
				end: 175.674
			},
			3: {
				start: 0.416,
				end: 177.770
			},
			4: {
				start: 0.000,
				end: 138.628
			},
			5: {
				start: 0.000,
				end: 186.119,
			},
			6: {
				start: 0.396,
				end: 165.777,
			},
			7: {
				start: 0.000,
				end: 137.524,
			},
			8: {
				start: 0.000,
				end: 142.308,
			},
			9: {
				start: 2.700,
				end: 130.613,
			},
			10: {
				start: 0.000,
				end: 116.657,
			},
			11: {
				start: 0.000,
				end: 142.220,
			},
			12: {
				start: 0.000,
				end: 109.480,
			},
			13: {
				start: 0.000,
				end: 144.945,
			},
			14: {
				start: 0.000,
				end: 130.274,
			},
			15: {
				start: 0.940,
				end: 82.985,
			},
			16: {
				start: 0.000,
				end: 130.280,
			},
			17: {
				start: 10.460,
				end: 136.090,
			},
			18: {
				start: 0.000,
				end: 134.920,
			},
			19: {
				start: 0.000,
				end: 127.740,
			},
			20: {
				start: 0.000,
				end: 120.780,
			},
			21: {
				start: 0.000,
				end: 153.528,
			},
			22: {
				start: 1.240,
				end: 101.750,
			},
			23: {
				start: 0.000,
				end: 80.386,
			}
		}
	},
	"wild-world": {
		sunny: {
			0: {
				start: 10.370,
				end: 108.830
			},
			1: {
				start: 12.970,
				end: 103.780
			},
			2: {
				start: 7.800,
				end: 144.785
			},
			3: {
				start: 12.118,
				end: 92.120
			},
			4: {
				start: 4.405,
				end: 51.225
			},
			5: {
				start: 0.000,
				end: 147.695
			},
			6: {
				start: 0.610,
				end: 78.985
			},
			7: {
				start: 4.670,
				end: 84.670
			},
			8: {
				start: 0.000,
				end: 53.335
			},
			9: {
				start: 0.490,
				end: 68.495
			},
			10: {
				start: 3.540,
				end: 81.380
			},
			11: {
				start: 0.620,
				end: 102.765
			},
			12: {
				start: 0.000,
				end: 170.660
			},
			13: {
				start: 5.615,
				end: 101.630
			},
			14: {
				start: 13.330,
				end: 119.985
			},
			15: {
				start: 0.000,
				end: 73.132
			},
			16: {
				start: 8.620,
				end: 100.520
			},
			17: {
				start: 0.000,
				end: 79.990
			},
			18: {
				start: 1.850,
				end: 109.850
			},
			19: {
				start: 1.300,
				end: 91.300
			},
			20: {
				start: 1.885,
				end: 149.620
			},
			21: {
				start: 1.840,
				end: 97.860
			},
			22: {
				start: 0.000,
				end: 181.600
			},
			23: {
				start: 0.000,
				end: 151.590
			}
		},
		snowing: {
			0: {
				start: 10.370,
				end: 108.830
			},
			1: {
				start: 12.970,
				end: 103.780
			},
			2: {
				start: 7.800,
				end: 144.785
			},
			3: {
				start: 12.118,
				end: 92.120
			},
			4: {
				start: 4.405,
				end: 51.225
			},
			5: {
				start: 0.000,
				end: 147.695
			},
			6: {
				start: 0.610,
				end: 78.985
			},
			7: {
				start: 4.670,
				end: 84.670
			},
			8: {
				start: 0.000,
				end: 53.335
			},
			9: {
				start: 0.490,
				end: 68.495
			},
			10: {
				start: 3.540,
				end: 81.380
			},
			11: {
				start: 0.620,
				end: 102.765
			},
			12: {
				start: 0.000,
				end: 170.695
			},
			13: {
				start: 5.990,
				end: 101.997
			},
			14: {
				start: 13.330,
				end: 119.985
			},
			15: {
				start: 0.000,
				end: 73.132
			},
			16: {
				start: 8.620,
				end: 100.520
			},
			17: {
				start: 0.000,
				end: 79.990
			},
			18: {
				start: 1.850,
				end: 109.850
			},
			19: {
				start: 1.300,
				end: 91.300
			},
			20: {
				start: 1.885,
				end: 149.620
			},
			21: {
				start: 1.840,
				end: 97.860
			},
			22: {
				start: 0.000,
				end: 181.600
			},
			23: {
				start: 0.000,
				end: 151.590
			}
		},
		raining: {
			0: {
				start: 10.370,
				end: 108.830
			},
			1: {
				start: 12.970,
				end: 103.780
			},
			2: {
				start: 7.800,
				end: 144.775
			},
			3: {
				start: 12.118,
				end: 92.120
			},
			4: {
				start: 4.405,
				end: 51.225
			},
			5: {
				start: 0.000,
				end: 147.685
			},
			6: {
				start: 0.610,
				end: 78.985
			},
			7: {
				start: 4.670,
				end: 84.650
			},
			8: {
				start: 0.000,
				end: 53.335
			},
			9: {
				start: 0.490,
				end: 68.495
			},
			10: {
				start: 3.540,
				end: 81.380
			},
			11: {
				start: 0.620,
				end: 102.765
			},
			12: {
				start: 0.000,
				end: 170.660
			},
			13: {
				start: 5.615,
				end: 101.630
			},
			14: {
				start: 13.330,
				end: 119.985
			},
			15: {
				start: 0.000,
				end: 73.132
			},
			16: {
				start: 8.620,
				end: 100.520
			},
			17: {
				start: 0.000,
				end: 79.990
			},
			18: {
				start: 1.850,
				end: 109.850
			},
			19: {
				start: 1.300,
				end: 91.300
			},
			20: {
				start: 1.885,
				end: 149.620
			},
			21: {
				start: 1.840,
				end: 97.860
			},
			22: {
				start: 0.000,
				end: 181.600
			},
			23: {
				start: 0.000,
				end: 151.590
			}
		}
	},
	"new-leaf": {
		sunny: {
			0: {
				start: 0.000,
				end: 78.980
			},
			1: {
				start: 0.000,
				end: 114.630
			},
			2: {
				start: 0.000,
				end: 167.000
			},
			3: {
				start: 0.000,
				end: 82.000
			},
			4: {
				start: 4.370,
				end: 109.080
			},
			5: {
				start: 0.000,
				end: 108.000
			},
			6: {
				start: 3.090,
				end: 77.660
			},
			7: {
				start: 8.100,
				end: 97.440
			},
			8: {
				start: 0.020,
				end: 86.410
			},
			9: {
				start: 0.010,
				end: 57.630
			},
			10: {
				start: 2.875,
				end: 82.045
			},
			11: {
				start: 0.000,
				end: 83.990
			},
			12: {
				start: 0.790,
				end: 86.510
			},
			13: {
				start: 7.100,
				end: 87.110
			},
			14: {
				start: 8.830,
				end: 93.550
			},
			15: {
				start: 0.000,
				end: 59.885
			},
			16: {
				start: 2.690,
				end: 92.670
			},
			17: {
				start: 9.405,
				end: 142.970
			},
			18: {
				start: 0.000,
				end: 89.665
			},
			19: {
				start: 7.075,
				end: 91.780
			},
			20: {
				start: 2.165,
				end: 85.670
			},
			21: {
				start: 3.040,
				end: 99.015
			},
			22: {
				start: 0.000,
				end: 73.440
			},
			23: {
				start: 0.000,
				end: 124.005
			}
		},
		snowing: {
			0: {
				start: 0.000,
				end: 78.980
			},
			1: {
				start: 0.000,
				end: 114.660
			},
			2: {
				start: 0.000,
				end: 167.000
			},
			3: {
				start: 0.000,
				end: 82.000
			},
			4: {
				start: 4.370,
				end: 109.080
			},
			5: {
				start: 0.000,
				end: 108.000
			},
			6: {
				start: 3.090,
				end: 77.660
			},
			7: {
				start: 8.100,
				end: 97.440
			},
			8: {
				start: 0.020,
				end: 86.410
			},
			9: {
				start: 0.010,
				end: 57.630
			},
			10: {
				start: 7.770,
				end: 86.900
			},
			11: {
				start: 0.000,
				end: 83.990
			},
			12: {
				start: 0.790,
				end: 86.510
			},
			13: {
				start: 7.100,
				end: 87.110
			},
			14: {
				start: 0.000,
				end: 80.810
			},
			15: {
				start: 0.000,
				end: 59.885
			},
			16: {
				start: 2.690,
				end: 92.670
			},
			17: {
				start: 9.395,
				end: 142.970
			},
			18: {
				start: 0.000,
				end: 89.665
			},
			19: {
				start: 7.075,
				end: 91.780
			},
			20: {
				start: 2.165,
				end: 85.670
			},
			21: {
				start: 8.290,
				end: 93.630
			},
			22: {
				start: 0.000,
				end: 73.440
			},
			23: {
				start: 0.000,
				end: 124.100
			}
		},
		raining: {
			0: {
				start: 0.000,
				end: 78.980
			},
			1: {
				start: 0.000,
				end: 114.630
			},
			2: {
				start: 0.000,
				end: 167.000
			},
			3: {
				start: 0.000,
				end: 82.000
			},
			4: {
				start: 4.370,
				end: 109.080
			},
			5: {
				start: 0.000,
				end: 108.000
			},
			6: {
				start: 3.090,
				end: 77.660
			},
			7: {
				start: 4.500,
				end: 93.850
			},
			8: {
				start: 0.020,
				end: 86.410
			},
			9: {
				start: 0.010,
				end: 57.630
			},
			10: {
				start: 7.770,
				end: 86.900
			},
			11: {
				start: 0.000,
				end: 83.990
			},
			12: {
				start: 0.790,
				end: 86.510
			},
			13: {
				start: 7.100,
				end: 87.110
			},
			14: {
				start: 0.000,
				end: 80.810
			},
			15: {
				start: 0.000,
				end: 59.885
			},
			16: {
				start: 2.690,
				end: 92.670
			},
			17: {
				start: 9.395,
				end: 142.970
			},
			18: {
				start: 0.000,
				end: 89.665
			},
			19: {
				start: 7.115,
				end: 91.780
			},
			20: {
				start: 2.165,
				end: 85.670
			},
			21: {
				start: 8.290,
				end: 93.630
			},
			22: {
				start: 0.000,
				end: 73.440
			},
			23: {
				start: 0.000,
				end: 124.005
			}
		}
	}
}
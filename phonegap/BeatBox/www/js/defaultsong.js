var defaultSong = {
	id: 0,
	name: 'Default Song',
	instruments: [{
			id: 0,
			name: 'Kick',
			sample: 'kick'
		},{
			id: 1,
			name: 'Snare',
			sample: 'snare'
		},{
			id: 2,
			name: 'Hi-Hat Closed',
			sample: 'hihat-closed'
		}],
	bmp: 120,
	timeSignature: [4,4],
	subdivisions: 2,
	patterns: [{
			id: 0,
			name: 'Pattern 1',
			bars: 1,
			parts: [{
				instrumentId: 0, 
				notes: [{
					bar: 0,
					beat: 0,
					subdivision: 0
				},{
					bar: 0,
					beat: 2,
					subdivision: 0
				}]
			},{
				instrumentId: 1, 
				notes: [{
					bar: 0,
					beat: 1,
					subdivision: 0
				},{
					bar: 0,
					beat: 3,
					subdivision: 0
				}]
			},{
				instrumentId: 2, 
				notes: [{
					bar: 0,
					beat: 0,
					subdivision: 0
				},{
					bar: 0,
					beat: 0,
					subdivision: 1
				},{
					bar: 0,
					beat: 1,
					subdivision: 0
				},{
					bar: 0,
					beat: 1,
					subdivision: 1
				},{
					bar: 0,
					beat: 2,
					subdivision: 0
				},{
					bar: 0,
					beat: 2,
					subdivision: 1
				},{
					bar: 0,
					beat: 3,
					subdivision: 0
				},{
					bar: 0,
					beat: 3,
					subdivision: 1
				}]
			}]
		},{
			id: 1,
			name: 'Pattern 2',
			bars: 1,
			parts: [{
				instrumentId: 0, 
				notes: [{
					bar: 0,
					beat: 0,
					subdivision: 0
				},{
					bar: 0,
					beat: 2,
					subdivision: 0
				}]
			},{
				instrumentId: 1, 
				notes: [{
					bar: 0,
					beat: 1,
					subdivision: 0
				},{
					bar: 0,
					beat: 3,
					subdivision: 0
				}]
			},{
				instrumentId: 2, 
				notes: [{
					bar: 0,
					beat: 0,
					subdivision: 0
				},{
					bar: 0,
					beat: 0,
					subdivision: 1
				},{
					bar: 0,
					beat: 1,
					subdivision: 0
				},{
					bar: 0,
					beat: 1,
					subdivision: 1
				},{
					bar: 0,
					beat: 2,
					subdivision: 0
				},{
					bar: 0,
					beat: 2,
					subdivision: 1
				},{
					bar: 0,
					beat: 3,
					subdivision: 0
				},{
					bar: 0,
					beat: 3,
					subdivision: 1
				}]
			}]
		}],
	sequence: [{
		patternIds: [0],
		repeats: 2
	},{
		patternIds: [1],
		repeats: 3
	},{
		patternIds: [0,1],
		repeats: 2
	}]
};
const test = require('./test.js');
const harvester = require('../dist/role_harvester');

// this assumes there are two sources in the room
const sourceCount = 2;
// find source with least count of harvesters assigned
// if there is a tie choose the one that has the oldest (soonest to die) harvester assigned


(function harvester_decideWhichSourceToHarvest_oneOtherHarvester_assignsToOtherSource() {
    // arrange
    const creeps = [{ memory: { sourceToHarvest: 0 }, ticksToLive: 1500 }];
    // act
    const result = harvester.decideWhichSourceToHarvest(creeps, 7);
    // assert
    const expected = 1;
    test.assertEqual(expected, result);
})();

(function foo() {
    // arrange
    const creeps = [{ memory: { sourceToHarvest: 1 }, ticksToLive: 1500 }, 
        { memory: { sourceToHarvest: 3 }, ticksToLive: 10 },
        { memory: { sourceToHarvest: 2 }, ticksToLive: 10 },
        { memory: { sourceToHarvest: 2 }, ticksToLive: 10 },
        { memory: { sourceToHarvest: 3 }, ticksToLive: 10 },
        { memory: { sourceToHarvest: 0 }, ticksToLive: 10 },
        { memory: { sourceToHarvest: 0 }, ticksToLive: 10 },
        { memory: { sourceToHarvest: 1 }, ticksToLive: 10 },
        { memory: { sourceToHarvest: 0 }, ticksToLive: 10 },
        { memory: { sourceToHarvest: 17 }, ticksToLive: 10 },
        { memory: { sourceToHarvest: 23 }, ticksToLive: 10 },
                ];
    // act
    const result = harvester.decideWhichSourceToHarvest(creeps, sourceCount);
    // assert
    const expected = 1;
    test.assertEqual(expected, result);
})();

(function harvester_decideWhichSourceToHarvest_twoOtherHarvesters_assignsToSourceWithOldestHarvester() {
    // arrange
    const creeps = [{ memory: { sourceToHarvest: 0 }, ticksToLive: 1500 }, 
                    { memory: { sourceToHarvest: 1 }, ticksToLive: 10 }];
    // act
    const result = harvester.decideWhichSourceToHarvest(creeps, sourceCount);
    // assert
    const expected = 1;
    test.assertEqual(expected, result);
})();

// function harvester_decideWhichSourceToHarvest_noOtherHarvesters_assignsToRandomSource() {
//     // todo
// }

const test = require('./test.js');
const harvester = require('../dist/role_harvester');


// these tests assume there are two sources in the room
function harvester_decideWhichSourceToHarvest_noOtherHarvesters_assignsToRandomSource() {
    // todo
}

(function harvester_decideWhichSourceToHarvest_oneOtherHarvester_assignsToOtherSource() {
    // arrange
    const creeps = [{ sourceToHarvest: 0, ticksToLive: 1500 }];
    // act
    const result = harvester.decideWhichSourceToHarvest(creeps);
    // assert
    const expected = 1;
    test.assertEqual(expected, result);
})();



console.log('hello from test land');
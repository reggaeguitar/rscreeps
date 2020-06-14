const simplemock = require('simple-mock');
const test = require('./test');
const sut = require('../src/creepUtil');
const logger = require('../src/logger');

// find source with least count of harvesters assigned
// if there is a tie choose the one that has the oldest (soonest to die) harvester assigned

(function harvester_decideWhichSourceToHarvest_oneOtherHarvester_assignsToOtherSource() {
    // arrange
    simplemock.mock(logger, 'fooPropTest');
    logger.fooPropTest.returnWith(45789);
    const creeps = [{ memory: { sourceToHarvest: 0 }, ticksToLive: 1500 }];

    // act
    const result = sut.fooTest();

    // assert
    const expected = 1;
    test.assertEqual(expected, result);
})();

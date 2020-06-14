const simplemock = require('simple-mock');
const test = require('./test');
const creepSpawn = require('../dist/spawn_creepSpawn');
const logger = require('../dist/logger');
const data = require('../dist/data');

module.exports = {
    setup: () => simplemock.restore(),
    creepSpawn_run_returnsFalseIfSpawnAlreadySpawning: () => {
        // arrange
        const room = {};
        const spawn = { spawning: true };
    
        // act
        const result = creepSpawn.run(room, spawn);
    
        // assert
        const expected = false;
        test.assertEqual(expected, result);
    },
    creepSpawn_run_returnsFalseIfNotEnoughEnergyToSpawnCreepInRoom: () => {
        // arrange       
        const room = { energyAvailable: 42 };
        const spawn = { spawning: false };
    
        const cheapestCreepCost = 50;
        simplemock.mock(data, 'cheapestCreepCost');
        data.cheapestCreepCost.returnWith(cheapestCreepCost);
    
        simplemock.mock(logger, 'log');
    
        // act
        const result = creepSpawn.run(room, spawn);
    
        // assert
        const expected = false;
        test.assertEqual(expected, result);
    
        // assert logger was called
        const expectedMessage = 'room has less than ' + cheapestCreepCost + ' energy ' + 
            room.energyAvailable + ', can\'t spawn creep';
    
        test.assertEqual(1, logger.log.callCount);
        test.assertEqual(expectedMessage, logger.log.lastCall.arg);
    },
}

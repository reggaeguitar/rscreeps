const simplemock = require('simple-mock');
const test = require('./test');
const util = require('../dist/util');
const gameAbstraction = require('../dist/gameAbstraction');

module.exports = {
    setup: () => simplemock.restore(),
    util_getCreepRoleCounts_returnsCountsCorrectly: () => {
        // arrange        
        simplemock.mock(gameAbstraction, 'creeps');
        gameAbstraction.creeps.returnWith({ 
            'upgrader19072262':  { memory: { role: 'upgrader' } },
            'upgrader19072263':  { memory: { role: 'upgrader' } },
            'builder19042269':   { memory: { role: 'builder' } },
            'harvester19076262': { memory: { role: 'harvester' } },
            'harvester19073262': { memory: { role: 'harvester' } },
            'upgrader19077262':  { memory: { role: 'upgrader' } },
            'upgrader19079262':  { memory: { role: 'upgrader' } },
            'hauler19042262':    { memory: { role: 'hauler' } },
        });
        
        // act
        const result = util.getCreepRoleCounts();
    
        // assert
        const expected = { 'upgrader': 4, 'harvester': 2, 'builder': 1, 'hauler': 1 };
        test.assertEqual(expected, result);
    },
}
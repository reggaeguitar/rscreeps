var _ = require('lodash');
var util = require('util');
var creepSpawn = require('creepSpawn');
var data = require('data');

var spawn1 = Game.spawns['Spawn1'];
var firstRoom = Game.rooms['W47N46'];

module.exports.loop = function () {
    
    function main() {
        //util.printCreepRoleCounts(creepData);
        util.clearDeadCreepsFromMemory();
        creepSpawn.spawnCreepIfPossible(firstRoom, spawn1);
        runCreepRoles();
    }
    
    function runCreepRoles() {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            data.creepData[creep.memory.role].roleObj.run(creep);
        }
    }
    
    main();
}

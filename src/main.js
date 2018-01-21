var _ = require('lodash');
var roleHarvester = require('role_harvester');
var roleUpgrader = require('role_upgrader');
var roleBuilder = require('role_builder');
var util = require('util');
var creepSpawn = require('creepSpawn');

var spawn = Game.spawns['Spawn1'];
var firstRoom = Game.rooms['W47N46'];

module.exports.loop = function () {
    
    function main() {
        //util.printCreepRoleCounts(creepData);
        util.clearDeadCreepsFromMemory();
        creepSpawn.spawnCreepIfPossible(firstRoom);
        runCreepRoles();
    }
    
    function runCreepRoles() {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            creepData[creep.memory.role].roleObj.run(creep);
        }
    }
    
    main();
}

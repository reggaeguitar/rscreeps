var _ = require('lodash');
var util = require('util');
var creepSpawn = require('creepSpawn');
var data = require('data');
var rebalancer = require('rebalancer');
var roleTower = require('role_tower');

var spawn1 = Game.spawns['Spawn1'];
var firstRoom = Game.rooms['W47N46'];

module.exports.loop = function () {
    
    function main() {
        //util.printCreepRoleCounts(data.creepData);
        rebalancer.run(firstRoom, spawn1);
        util.clearDeadCreepsFromMemory();
        creepSpawn.run(firstRoom, spawn1);
        runTowers(firstRoom);
        runCreepRoles();
    }
    
    function runCreepRoles() {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (Game.time % data.roleSayInterval == 0) {
                creep.say(creep.memory.role);
            }
            data.creepData[creep.memory.role].roleObj.run(creep);
        }
    }
 
    function runTowers(room) {
        // var tower = Game.getObjectById('5a6760476bcd94176062af15');
        // roleTower.run(tower);
        room.find(FIND_MY_STRUCTURES, { filter: 
            s => s.structureType == STRUCTURE_TOWER }).forEach(
                tower => roleTower.run(tower)
            );        
    }
    
    main();
}

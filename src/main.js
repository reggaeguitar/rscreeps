const _ = require('lodash');
const util = require('util');
const creepSpawn = require('creepSpawn');
const data = require('data');
const roleTower = require('role_tower');
const constructionDecider = require('buildingPlacement_constructionDecider');

const spawn1 = Game.spawns['Spawn1'];
const firstRoom = Game.rooms['E24N7'];

module.exports.loop = function () {
    
    function main() {
        util.printCreepRoleCounts(util.creepData());
        util.clearDeadCreepsFromMemory();
        creepSpawn.run(firstRoom, spawn1);
        runTowers(firstRoom);
        runConstruction(firstRoom, spawn1);
        runCreepRoles();
    }
    
    function runCreepRoles() {
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (Game.time % data.roleSayInterval == 0) {
                creep.say(creep.memory.role);
            }
            util.creepData()[creep.memory.role].roleObj.run(creep);
        }
    }
 
    function runTowers(room) {
        room.find(FIND_MY_STRUCTURES, { filter: 
            s => s.structureType == STRUCTURE_TOWER }).forEach(
                tower => roleTower.run(tower));        
    }

    function runConstruction(room, spawn) {
        if (Game.time % data.buildInterval == 0) 
            constructionDecider.run(room, spawn);
    }
    
    main();
}

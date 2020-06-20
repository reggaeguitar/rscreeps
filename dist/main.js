const _ = require('lodash');
const util = require('./util');
const creepSpawn = require('./spawn_creepSpawn');
const data = require('./data');
const roleTower = require('./role_tower');
const constructionDecider = require('./buildingPlacement_constructionDecider');
const mapUtil = require('./mapUtil');
const creepData = require('./role_creepData');
const roomService = require('./roomExpansion_roomService');
const roomMemory = require('./roomExpansion_roomMemory');

// This code assumes first spawn is named 'Spawn1'

module.exports.loop = function () {    
    function main() {
        util.printCreepRoleCounts(creepData.creepData());
        
        util.clearDeadCreepsFromMemory();

        roomService.run();

        const rooms = roomMemory.ownedRooms();

        rooms.map(roomName => {
            const room = Game.rooms[roomName];
            runTowers(room);
            const spawn = mapUtil.getSpawnInRoom(room);
            if (!spawn) return;
            if (Game.time % data.buildInterval == 0) {
                constructionDecider.run(room, spawn);
                // save cpu by returning early
                return;
            }
            creepSpawn.run(room, spawn);
        })
        runCreepRoles();
    }
    
    function runCreepRoles() {
        const cd = creepData.creepData();
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            if (Game.time % data.roleSayInterval == 0) {
                creep.say(creep.memory.role);
            }
            cd[creep.memory.role].roleObj.run(creep);
        }
    }
 
    function runTowers(room) {
        // perf cache tower id
        const potentialTowers = room.find(FIND_MY_STRUCTURES, { filter: 
            s => s.structureType == STRUCTURE_TOWER });
        if (potentialTowers != undefined) {
            potentialTowers.forEach(tower => roleTower.run(tower));        
        }
    }
    
    main();
}

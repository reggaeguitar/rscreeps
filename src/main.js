const _ = require('lodash');
const util = require('./util');
const creepSpawn = require('./spawn_creepSpawn');
const data = require('./data');
const roleTower = require('./role_tower');
const constructionDecider = require('./buildingPlacement_constructionDecider');
const mapUtil = require('./mapUtil');
const creepData = require('./role_creepData');

module.exports.loop = function () {    
    function main() {
        // todo find inital spawn and use roomname instead
        const firstRoom = ['E13S43']; // todo when respawning change this to new room name

        util.printCreepRoleCounts(creepData.creepData());
        util.clearDeadCreepsFromMemory();
        let rooms = util.getRoomNames();
        if (rooms.length == 0) // will happen when respawning
            rooms = [firstRoom];
        rooms.map(roomName => {
            const room = Game.rooms[roomName];
            runTowers(room);
            const spawn = mapUtil.getSpawnInRoom(room);
            if (spawn != undefined) {
                creepSpawn.run(room, spawn);
                runConstruction(room, spawn);
            }
        })
        runCreepRoles();
    }
    
    function runCreepRoles() {
        let cd = creepData.creepData();
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            if (Game.time % data.roleSayInterval == 0) {
                creep.say(creep.memory.role);
            }
            cd[creep.memory.role].roleObj.run(creep);
        }
    }
 
    function runTowers(room) {
        // perf cache tower id
        let potentialTowers = room.find(FIND_MY_STRUCTURES, { filter: 
            s => s.structureType == STRUCTURE_TOWER });
        if (potentialTowers != undefined) {
            potentialTowers.forEach(tower => roleTower.run(tower));        
        }
    }

    function runConstruction(room, spawn) {
        if (Game.time % data.buildInterval == 0) 
            constructionDecider.run(room, spawn);
    }
    
    main();
}

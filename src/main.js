const _ = require('lodash');
const util = require('util');
const creepSpawn = require('creepSpawn');
const data = require('data');
const roleTower = require('role_tower');
const constructionDecider = require('buildingPlacement_constructionDecider');
const mapUtil = require('mapUtil');

const firstRoom = Game.rooms['E24N7']; // todo when respawning change this to new room name

module.exports.loop = function () {    
    function main() {
        util.printCreepRoleCounts(util.creepData());
        util.clearDeadCreepsFromMemory();
        let rooms = util.getRoomNames();
        if (rooms.length == 0) // will happen when respawning
            rooms = [firstRoom];
        rooms.map(roomName => {
            let room = Game.rooms[roomName];
            let spawn = mapUtil.getSpawnInRoom(room);
            creepSpawn.run(room, spawn);
            runTowers(room);
            runConstruction(room, spawn);    
        })
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
        // perf cache tower id
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

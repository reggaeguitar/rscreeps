const _ = require('lodash');
const logger = require('./logger');
const gameAbstraction = require('./gameAbstraction');
const memoryAbstraction = require('./memoryAbstraction');

module.exports = {
    // perf cache results from these methods   
    printCreepRoleCounts: function() {
        logger.log('creepRoleCounts:', this.getCreepRoleCounts());
    },
    getCreepRoleCounts: function() {
        return _.countBy(gameAbstraction.creeps(), c => c.memory.role);
    },   
    clearDeadCreepsFromMemory: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];                
            }
        }
        // console.log(JSON.stringify(memoryAbstraction.creeps()));
        // for (let name in memoryAbstraction.creeps()) {
        //     if (!gameAbstraction.creeps()[name]) {
        //         delete Memory.creeps[name];                
        //     }
        // }
    },    
    getCreepCount: function() {
        return Object.keys(gameAbstraction.creeps()).length;
    },
    getRoomNames: function() {
        // todo use uniqBy when able to
        // _.uniqBy(gameAbstraction.creeps(), c => c.room.name);
        let _roomCache;
        if (_roomCache != undefined) {
            return _roomCache;
        } else {
            let rooms = [];
            for (let name in gameAbstraction.creeps()) {
                let roomName = gameAbstraction.creeps()[name].room.name;
                if (rooms.find(r => r == roomName) == undefined) {
                    rooms.push(roomName)
                }
            }
            _roomCache = rooms;
            return rooms;
        }
    }
};
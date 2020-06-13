const _ = require('./lodash');
const logger = require('./logger');

module.exports = {
    // perf cache results from these methods   
    printCreepRoleCounts: function() {
        logger.log('creepRoleCounts:', this.getCreepRoleCounts());
    },
    getCreepRoleCounts: function() {
        return _.countBy(Game.creeps, c => c.memory.role);
    },   
    clearDeadCreepsFromMemory: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];                
            }
        }
    },    
    getCreepCount: function() {
        return Object.keys(Game.creeps).length;
    },
    getRoles: function() {
        return Object.keys(this.creepData);
    },    
    getRoomNames: function() {
        // todo use uniqBy when able to
        // _.uniqBy(Game.creeps, c => c.room.name);
        let _roomCache;
        if (_roomCache != undefined) {
            return _roomCache;
        } else {
            let rooms = [];
            for (let name in Game.creeps) {
                let roomName = Game.creeps[name].room.name;
                if (rooms.find(r => r == roomName) == undefined) {
                    rooms.push(roomName)
                }
            }
            _roomCache = rooms;
            return rooms;
        }
    }
};
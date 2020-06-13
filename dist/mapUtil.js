const _ = require('./lodash');

module.exports = {
    directions: [
        { TOP: 1, mutatorFunc: (pos) => { return new RoomPosition(pos.x, pos.y - 1, pos.roomName); } },
        { TOP_RIGHT: 2, mutatorFunc: (pos) => { return new RoomPosition(pos.x + 1, pos.y - 1, pos.roomName); } },
        { RIGHT: 3, mutatorFunc: (pos) => { return new RoomPosition(pos.x + 1, pos.y, pos.roomName); } },
        { BOTTOM_RIGHT: 4, mutatorFunc: (pos) => { return new RoomPosition(pos.x + 1, pos.y + 1, pos.roomName); } },
        { BOTTOM: 5, mutatorFunc: (pos) => { return new RoomPosition(pos.x, pos.y + 1, pos.roomName); } },
        { BOTTOM_LEFT: 6, mutatorFunc: (pos) => { return new RoomPosition(pos.x - 1, pos.y + 1, pos.roomName); } },
        { LEFT: 7, mutatorFunc: (pos) => { return new RoomPosition(pos.x - 1, pos.y, pos.roomName); } },
        { TOP_LEFT: 8, mutatorFunc: (pos) => { return new RoomPosition(pos.x - 1, pos.y - 1, pos.roomName); } },
    ],
    // todo make code work for multiple spawns
    // todo see if room even has a spawn
    // todo add logic to build spawn if able
    getSpawnInRoom: room => {
        let potentialSpawns = _.filter(room.find(FIND_STRUCTURES), 
            r => r.structureType == 'spawn');
        if (potentialSpawns.length > 0) return potentialSpawns[0];
    }
}
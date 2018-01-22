var roleHarvester = require('role_harvester');
var roleUpgrader = require('role_upgrader');
var roleBuilder = require('role_builder');

module.exports = {
    creepData: {
        'harvester': { roleObj: roleHarvester },
        'upgrader': { roleObj: roleUpgrader },
        'builder': { roleObj: roleBuilder },
    },
    maxCreepCount: 4,
    roleSayInterval : 10,
    directions: [
        { TOP: 1, mutatorFunc: (pos, roomName) => { return new RoomPosition(pos.x, pos.y + 1, roomName); } },
        { TOP_RIGHT: 2, mutatorFunc: (pos, roomName) => { return new RoomPosition(pos.x + 1, pos.y + 1, roomName); } },
        { RIGHT: 3, mutatorFunc: (pos, roomName) => { return new RoomPosition(pos.x + 1, pos.y, roomName); } },
        { BOTTOM_RIGHT: 4, mutatorFunc: (pos, roomName) => { return new RoomPosition(pos.x + 1, pos.y - 1, roomName); } },
        { BOTTOM: 5, mutatorFunc: (pos, roomName) => { return new RoomPosition(pos.x, pos.y -1, roomName); } },
        { BOTTOM_LEFT: 6, mutatorFunc: (pos, roomName) => { return new RoomPosition(pos.x - 1, pos.y - 1, roomName); } },
        { LEFT: 7, mutatorFunc: (pos, roomName) => { return new RoomPosition(pos.x - 1, pos.y, roomName); } },
        { TOP_LEFT: 8, mutatorFunc: (pos, roomName) => { return new RoomPosition(pos.x - 1, pos.y + 1, roomName); } },
    ],
};
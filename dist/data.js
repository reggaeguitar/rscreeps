module.exports = {
    log: false,
    minHaulerCount: 2,
    maxHarvesterCount: 2,
    maxWorkerCount: 6,
    roleSayInterval: 5,
    goodHarvesterWorkCount: function(room) { return room.controller.level > 2 ? 6 : 3 },
    harvesterMoveCount: 1,
    energyBuffer: 100,
    harvesterTicksToLive: 50,
    buildInterval: 20,
    containerCapacity: 2000,
};
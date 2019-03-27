module.exports = {
    // todo make properties that depend on room functions
    // that take a room as a param    
    log: false,
    minHaulerCount: 3,
    maxHarvesterCount: 2,
    maxWorkerCount: 6,
    roleSayInterval: 5,
    goodHarvesterWorkCount: room => room.controller.level > 2 ? 6 : 3,
    harvesterMoveCount: 2,
    energyBuffer: 100,
    harvesterTicksToLive: 50,
    buildInterval: 100,
    containerCapacity: 2000,
};
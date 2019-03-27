module.exports = {
    // globals
    log: false,
    roleSayInterval: 5,
    buildInterval: 100,
    containerCapacity: 2000,
    // room specifics
    // todo cache source count in Memory
    minHaulerCount: room => {
        let sourceCount = room.find(FIND_SOURCES).length;
        return sourceCount + (room.controller.level - 3);
    },
    maxHarvesterCount: room => room.find(FIND_SOURCES).length,
    maxWorkerCount: room => 6,
    goodHarvesterWorkCount: room => room.controller.level > 2 ? 6 : 3,
    harvesterMoveCount: room => Math.round(room.controller.level / 2),
    harvesterTicksToLive: room => 50,
};
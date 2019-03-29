module.exports = {
    // globals
    log: false,
    roleSayInterval: 5,
    buildInterval: 100,
    containerCapacity: 2000,
    // room specifics
    // todo perf cache source count in Memory
    minHaulerCount: room => {
        // todo hauler count depends on hauling distance,
        // might not need many with links too
        let sourceCount = room.find(FIND_SOURCES).length;
        let extraHaulerCount = room.controller.level - 5;
        return sourceCount + (extraHaulerCount > 0 ? extraHaulerCount : 0);
    },
    maxHarvesterCount: room => room.find(FIND_SOURCES).length,
    maxWorkerCount: room => 6,
    goodHarvesterWorkCount: room => room.controller.level > 2 ? 6 : 3,
    harvesterMoveCount: room => Math.round(room.controller.level / 2),
    harvesterTicksToLive: room => 50,
    minEnergy: room => room.controller.level * 100,
};
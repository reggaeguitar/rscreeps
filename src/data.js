module.exports = {
    // globals
    log: false,
    notify: true,
    roleSayInterval: 5,
    buildInterval: 100,
    containerCapacity: 2000,
    sourceScore: 10,
    pathScoreFactor: 10,
    // room specifics
    // todo perf cache source count in Memory
    minHaulerCount: room => {
        // todo hauler count depends on hauling distance,
        // might not need many with links too
        let sourceCount = room.find(FIND_SOURCES).length;
        let extraHaulerCount = room.controller.level - 3;
        return sourceCount + (extraHaulerCount > 0 ? extraHaulerCount : 0);
    },
    maxHarvesterCount: room => room.find(FIND_SOURCES).length,
    maxWorkerCount: room => 6,
    goodHarvesterWorkCount: room => room.controller.level > 2 ? 6 : 3,
    harvesterMoveCount: room => 1,
    harvesterTicksToLive: room => 50,
    minEnergy: room => room.controller.level * 100,
};
module.exports = {
    // globals
    log: true,
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
        // and amount of energy in dropped piles
        // might not need many with links too
        let sourceCount = room.find(FIND_SOURCES).length;
        let extraHaulerCount = room.controller.level - 3;
        return sourceCount + (extraHaulerCount > 0 ? extraHaulerCount : 0);
    },
    maxHarvesterCount: room => room.find(FIND_SOURCES).length,
    maxWorkerCount: room => room.controller.level > 2 ? 6 : 10,
    // todo change to 200 when done testing
    cheapestCreepCost: room => 150,
    goodHarvesterWorkCount: room => {
      // todo change this back to "return 2" when done testing
      if (room.controller.level == 2) return 1;
      return room.controller.level > 2 ? 6 : 3;
    },
    harvesterMoveCount: room => 1,
    harvesterTicksToLive: room => 50,
    minEnergy: room => room.controller.level * 100,
};
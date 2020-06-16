const util = require('./util');
const _ = require('lodash');


module.exports = {
    energyThreshold: 150,
    energyAvailableThreshold: 0.8,
    maxWorkerCount: function(room, creepCountsByRole) {
        const droppedEnergy = room.find(FIND_DROPPED_RESOURCES)
            .filter(x => x.resourceType = RESOURCE_ENERGY);
        const totalDroppedEnergy = _.sum(droppedEnergy, x => x.amount);
        const lotsOfDroppedEnergy = totalDroppedEnergy > room.controller.level * this.energyThreshold;
        const lotsOfAvailableEnergy = room.energyAvailable >= room.energyCapacityAvailable * this.energyAvailableThreshold;
        if (lotsOfDroppedEnergy && lotsOfAvailableEnergy) {
            const curWorkerCount = util.workerCount(room.name, creepCountsByRole);
            return curWorkerCount + 1;
        }
        return room.controller.level > 1 ? 8 : 6;
    }
}
const util = require('./util');
const _ = require('lodash');


module.exports = {
    energyThreshold: 100,
    maxWorkerCount: function(room, creepCountsByRole) {
        const droppedEnergy = room.find(FIND_DROPPED_RESOURCES)
            .filter(x => x.resourceType = RESOURCE_ENERGY);
        const totalDroppedEnergy = _.sum(droppedEnergy, x => x.amount);
        if (totalDroppedEnergy > room.controller.level * this) {
            const curWorkerCount = util.workerCount(room.name, creepCountsByRole);
            return curWorkerCount + 1;
        }
        return room.controller.level > 1 ? 8 : 6;
    }
}
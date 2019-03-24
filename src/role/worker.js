const harvest = require('harvest');
const creepUtil = require('creepUtil');

module.exports = {
    run: function(creep, doWork) {
        // 4 possible states
        if (creep.carry.energy == 0 && !creep.memory.harvesting) {
            // done working, need to harvest again
            creep.memory.harvesting = true;
            harvest.doHarvest(creep);
        } else if (creep.memory.harvesting && creep.carry.energy != creep.carryCapacity) {
            // harvesting, not full yet
            harvest.doHarvest(creep);
        } else if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            // harvesting, full
            creep.memory.harvesting = false;
            doWork(creep);
        } else if (!creep.memory.harvesting) {
            // doing work
            if (creepUtil.creepIsNextToSource(creep)) {                
                creepUtil.moveAwayFromSource(creep);
            } else {
                doWork(creep);
            }
        }       
    }    
};

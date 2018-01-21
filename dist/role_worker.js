var harvest = require('harvest');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep, doWork) {
        // 4 possible states
        if (creep.carry.energy == 0 && !creep.memory.harvesting) {
            // done working, need to harvest again
            creep.memory.harvesting = true;
            harvest.startHarvest(creep);
        } else if (creep.memory.harvesting && creep.carry.energy != creep.carryCapacity) {
            // harvesting, not full yet
            harvest.doHarvest(creep);
        } else if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            // harvesting, full
            creep.memory.harvesting = false;
            doWork(creep);
        } else if (!creep.memory.harvesting) {
            // doing work
            doWork(creep);
        }       
    }    
};

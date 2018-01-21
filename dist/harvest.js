var _ = require('lodash');

module.exports = {
    doHarvest: function (creep) {
        //if (creep.memory.harvesting === false) {
        //    harvesting = true;
        //    creep.memory.sourceIndex = _
        //}
        //if (creep.carry.energy == creep.energyCapacity) {
        //    creep.memory.sourceIndex = -1;
        //}
        //if (creep.memory.sourceIndex == -1) {
        //    var sources = creep.room.find(FIND_SOURCES);
        //    creep.memory.sourceIndex = 
        //}
        var sources = creep.room.find(FIND_SOURCES);
        var sourceToHarvest = 0;//_.random(0, sources.length);
        if(creep.harvest(sources[sourceToHarvest]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[sourceToHarvest], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};
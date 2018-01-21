var _ = require('lodash');

module.exports = {
    doHarvest: function (creep) {
        var sources = this.getSources(creep);
        if (creep.harvest(sources[creep.memory.sourceToHarvest]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.sourceToHarvest], 
                { visualizePathStyle: {stroke: '#ffaa00' } });
        }
    },
    startHarvest: function(creep) {
        var sources = this.getSources(creep);
        var sourceToHarvest = _.random(0, sources.length - 1);
        creep.memory.sourceToHarvest = sourceToHarvest;
        this.doHarvest(creep);
    },
    getSources: function(creep) {
        return creep.room.find(FIND_SOURCES);
    }
};
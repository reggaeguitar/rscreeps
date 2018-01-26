var worker = require('role_worker');

module.exports = {
    run: function(creep) {
        if (creep.memory.sourceToHarvest == undefined) {
            this.startHarvest(creep);
        }
        this.mineSources(creep);
    },
    mineSources: function(creep) {
        if (creep.harvest(sources[creep.memory.sourceToHarvest]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.sourceToHarvest], 
                { visualizePathStyle: {stroke: '#ffaa00' } });
        }
    },    
    startHarvest: function(creep) {
        var sources = mapUtil.getSources(creep);
        var sourceToHarvest = _.random(0, sources.length - 1);
        creep.memory.sourceToHarvest = sourceToHarvest;
        this.doHarvest(creep);
    }
};

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
        var sourcesAssigned = this.getCreepSourcesToMine();
        //var min = _.minBy(sourcesAssigned, s => s);
        // todo pick the math.min of sources assigned to mine
        var sources = this.getSources(creep);
        var sourceToHarvest = _.random(0, sources.length - 1); // min
        creep.memory.sourceToHarvest = sourceToHarvest;
        this.doHarvest(creep);
    },
    getCreepSourcesToMine: function() {
        var ret = {};
        for (var creep in Game.creeps) {
            if (creep.hasOwnProperty('sourceToHarvest')) {
                var sourceToMine = creep.memory.sourceToHarvest;
                ret[sourceToMine] = ret[sourceToMine] + 1;
            }            
        }
        return ret;
    },
    getSources: function(creep) {
        return creep.room.find(FIND_SOURCES);
    }
};
var _ = require('lodash');
var util = require('util');
var mapUtil = require('mapUtil');

module.exports = {    
    doHarvest: function (creep) {
        var sources = util.getSources(creep);
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
};
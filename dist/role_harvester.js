var worker = require('role_worker');
var mapUtil = require('mapUtil');
var util = require('util');

module.exports = {
    run: function(creep) {
        var sources = mapUtil.getSources(creep);
        if (creep.memory.sourceToHarvest == undefined) {
            this.startHarvest(creep, sources);
        }
        this.mineSources(creep, sources);
    },
    mineSources: function(creep, sources) {
        if (creep.harvest(sources[creep.memory.sourceToHarvest]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.sourceToHarvest], 
                { visualizePathStyle: {stroke: '#ffaa00' } });
        }
    },    
    startHarvest: function(creep, sources) {
        var creepRoleCounts = util.getCreepRoleCounts();
        var sourceToHarvest = 0;
        if (creepRoleCounts.hasOwnProperty('harvester')) {
            var otherHarvesterSource = _.filter(Game.creeps, 
                c => c.memory.role == 'harvester')[0]
                    .memory.sourceToHarvest;
            sourceToHarvest = otherHarvesterSource == 0 ? 1 : 0;
        } else {
            sourceToHarvest = _.random(0, sources.length - 1);
        }        
        creep.memory.sourceToHarvest = sourceToHarvest;
    }
};

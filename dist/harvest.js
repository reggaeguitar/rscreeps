var _ = require('lodash');
var mapUtil = require('mapUtil');

module.exports = {    
    doHarvest: function (creep) {
        var closestNonEmptyStorageOrContainer = creep.pos.findClosestByRange(
            FIND_STRUCTURES, { filter : s => 
                (s.structureType == STRUCTURE_STORAGE || 
                s.structureType == STRUCTURE_CONTAINER) &&
                _.sum(s.store) > 0 });
        if (closestNonEmptyStorageOrContainer.length > 0) {
            // todo get energy
        }
    },
    
    
    startHarvest: function(creep) {
        var sources = mapUtil.getSources(creep);
        var sourceToHarvest = _.random(0, sources.length - 1);
        creep.memory.sourceToHarvest = sourceToHarvest;
        this.doHarvest(creep);
    }
};
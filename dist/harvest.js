var _ = require('lodash');
var mapUtil = require('mapUtil');

module.exports = {        
    doHarvest: function (creep) {
        var closestNonEmptyStorageOrContainer = creep.pos.findClosestByRange(
            FIND_STRUCTURES, { filter : s => 
                (s.structureType == STRUCTURE_STORAGE || 
                s.structureType == STRUCTURE_CONTAINER) &&
                _.sum(s.store) > 0 });
        if (closestNonEmptyStorageOrContainer != undefined) {
            if (creep.transfer(closestNonEmptyStorageOrContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }           
        }
    },
};
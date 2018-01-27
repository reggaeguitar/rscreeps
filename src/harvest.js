var _ = require('lodash');
var mapUtil = require('mapUtil');

module.exports = {        
    doHarvest: function (creep) {
        var closestEnergyLocation;
        if (creep.memory.role == 'hauler') {
            closestEnergyLocation = creep.pos.findClosestByRange(
                FIND_STRUCTURES, { filter : s => 
                    s.structureType == STRUCTURE_CONTAINER &&
                    _.sum(s.store) > 200 });
        } else {
            closestEnergyLocation = creep.pos.findClosestByRange(
                FIND_STRUCTURES, { filter : s => 
                    (s.structureType == STRUCTURE_STORAGE || 
                    s.structureType == STRUCTURE_CONTAINER) &&
                    _.sum(s.store) > 200 });
        }
        if (closestEnergyLocation != undefined) {
            if (creep.withdraw(closestEnergyLocation, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnergyLocation);
            }           
        }
    },
};
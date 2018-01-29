var _ = require('lodash');
var mapUtil = require('mapUtil');

module.exports = {        
    doHarvest: function (creep) {
        var closestEnergyLocation;        
        if (creep.memory.role == 'hauler') {
            const almostFullFactor = 0.75;
            var almostFullContainer = creep.pos.findClosestByRange(
                FIND_STRUCTURES, { filter: s => 
                    s.structureType == STRUCTURE_CONTAINER &&
                    _.sum(s.store) > s.storeCapacity * almostFullFactor });
            if (almostFullContainers != undefined) {
                closestEnergyLocation = almostFullContainer;
            } else {            
                closestEnergyLocation = creep.pos.findClosestByRange(
                    FIND_STRUCTURES, { filter : s => 
                        s.structureType == STRUCTURE_CONTAINER &&
                        _.sum(s.store) > 200 });
            }
        } else {
            closestEnergyLocation = creep.pos.findClosestByRange(
                FIND_STRUCTURES, { filter : s => 
                    s.structureType == STRUCTURE_STORAGE &&
                    _.sum(s.store) > 200 });
        }
        if (closestEnergyLocation != undefined) {
            if (creep.withdraw(closestEnergyLocation, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnergyLocation);
            }           
        }
    },
};
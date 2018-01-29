var _ = require('lodash');
var mapUtil = require('mapUtil');

module.exports = {        
    doHarvest: function (creep) {
        var closestEnergyLocation;
        // pick up dropped energy
        var droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (droppedEnergy != undefined) {
            if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy);
                return;
            }
        }   
        if (creep.memory.role == 'hauler') {
            const almostFullFactor = 0.75;
            var almostFullContainer = creep.pos.findClosestByRange(
                FIND_STRUCTURES, { filter: s => 
                    s.structureType == STRUCTURE_CONTAINER &&
                    _.sum(s.store) > s.storeCapacity * almostFullFactor });
            if (almostFullContainer != undefined) {
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
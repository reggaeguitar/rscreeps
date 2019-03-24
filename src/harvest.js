const _ = require('lodash');

module.exports = {        
    doHarvest: function (creep) {
        let closestEnergyLocation;
        if (creep.memory.role == 'hauler') {
            if (this.pickedUpDroppedEnergy(creep)) return;
            const almostFullFactor = 0.75;
            let almostFullContainer = creep.pos.findClosestByRange(
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
    pickedUpDroppedEnergy(creep) {
        let droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (droppedEnergy != undefined) {
            if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy);
                return true;
            }
        }
        return false; 
    },
};
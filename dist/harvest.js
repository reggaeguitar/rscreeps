const _ = require('lodash');

module.exports = {        
    doHarvest: function (creep) {
        const minEnergy = 200;
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
                closestEnergyLocation = findBuildingWithMoreThanXEnergy(creep, minEnergy, STRUCTURE_CONTAINER);
            }
        } else {
            closestEnergyLocation = findBuildingWithMoreThanXEnergy(creep, minEnergy, STRUCTURE_STORAGE);            
            if (closestEnergyLocation == undefined) {
                closestEnergyLocation = findBuildingWithMoreThanXEnergy(creep, minEnergy, STRUCTURE_CONTAINER);
            }
        }
        if (closestEnergyLocation != undefined) {
            if (creep.withdraw(closestEnergyLocation, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnergyLocation);
            }           
        }

        function findBuildingWithMoreThanXEnergy(creep, x, structureType) {
            return closestEnergyLocation = creep.pos.findClosestByRange(
                FIND_STRUCTURES, { filter : s => 
                    s.structureType == structureType &&
                    _.sum(s.store) > x });   
        }
    },
    pickedUpDroppedEnergy(creep) {
        let droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (droppedEnergy != undefined && creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedEnergy);
            return true;
        }
        return false; 
    },
};
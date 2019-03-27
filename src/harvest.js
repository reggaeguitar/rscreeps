const _ = require('lodash');
const data = require('data');

module.exports = {     
    doHarvest: function (creep) {
        let minEnergy = data.minEnergy(creep.room);
        let closestEnergyLocation;
        if (creep.memory.role == 'hauler') {
            closestEnergyLocation = this.runHauler(creep, minEnergy);
        } else {
            closestEnergyLocation = this.findBuildingWithMoreThanXEnergy(
                creep, minEnergy, STRUCTURE_STORAGE);            
            if (closestEnergyLocation == undefined) {
                closestEnergyLocation = this.findBuildingWithMoreThanXEnergy(
                    creep, minEnergy, STRUCTURE_CONTAINER);
            }
            if (closestEnergyLocation == undefined) this.pickedUpDroppedEnergy(creep, minEnergy);
        }
        if (closestEnergyLocation != undefined) {
            if (creep.withdraw(closestEnergyLocation, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnergyLocation);
            }           
        }
        
    },
    findBuildingWithMoreThanXEnergy: function (creep, x, structureType) {
        return closestEnergyLocation = creep.pos.findClosestByRange(
            FIND_STRUCTURES, { filter : s => 
                s.structureType == structureType &&
                _.sum(s.store) > x });   
    },
    runHauler: function(creep, minEnergy) {
        if (this.pickedUpDroppedEnergy(creep, minEnergy)) return;
        const almostFullFactor = 0.75;
        let almostFullContainer = creep.pos.findClosestByRange(
            FIND_STRUCTURES, { filter: s => 
                s.structureType == STRUCTURE_CONTAINER &&
                _.sum(s.store) > s.storeCapacity * almostFullFactor });
        if (almostFullContainer != undefined) {
            return almostFullContainer;
        } else {        
            return this.findBuildingWithMoreThanXEnergy(
                creep, minEnergy, STRUCTURE_CONTAINER);
        }  
    },
    pickedUpDroppedEnergy: function(creep, minEnergy) {
        let droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        let closestValid = droppedEnergy != undefined && droppedEnergy.amount > minEnergy;
        
        if (closestValid) {
            return pickup(creep, droppedEnergy);
        } else {
            let droppedEnergies = creep.room.find(FIND_DROPPED_RESOURCES);
            droppedEnergies.forEach(e => {
                if (e.amount > minEnergy) {
                    return pickup(creep, e);
                }
            });
        }

        function pickup(creep, droppedEnergy) {
            if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy);
            }
            return true;
        }
        return false; 
    },
};
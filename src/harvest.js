const _ = require('lodash');
const data = require('data');
const roles = require('roles');

module.exports = {     
    doHarvest: function (creep) {
        let minEnergy = data.minEnergy(creep.room);
        let closestEnergyLocation;
        if (creep.memory.role == roles.RoleHauler) {
            closestEnergyLocation = this.runHauler(creep, minEnergy);
        } else {
            closestEnergyLocation = this.findBuildingWithMoreThanXEnergy(
                creep, minEnergy, STRUCTURE_STORAGE);            
            if (closestEnergyLocation == undefined) {
                closestEnergyLocation = this.findBuildingWithMoreThanXEnergy(
                    creep, minEnergy, STRUCTURE_CONTAINER);
            }
            if (closestEnergyLocation != undefined) {
                this.withdraw(creep, closestEnergyLocation);
            } else {
                this.getDroppedOrTombstoneEnergy(creep);
            }
        }
    },
    findBuildingWithMoreThanXEnergy: function (creep, x, structureType) {
        return closestEnergyLocation = creep.pos.findClosestByPath(
            FIND_STRUCTURES, { filter : s => 
                s.structureType == structureType &&
                _.sum(s.store) > x });   
    },
    runHauler: function(creep, minEnergy) {
        if (this.getDroppedOrTombstoneEnergy(creep)) return;
        const almostFullFactor = 0.75;
        let almostFullContainer = creep.pos.findClosestByPath(
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
    getDroppedOrTombstoneEnergy: function(creep) {        
       if (this.pickUpTombstoneEnergy(creep)) {
           return true;
       } else {
           return this.pickUpDroppedEnergy(creep);
       }
    },
    pickUpTombstoneEnergy: function(creep) {
        // this only looks at the closest tombstone
        let tombstones = creep.pos.findClosestByPath(FIND_TOMBSTONES);
        if (tombstones != undefined && tombstones[0].store[RESOURCE_ENERGY] != 0) {
            this.withdraw(creep, tombstones[0]);
        }
    },
    withdraw: function(creep, buildingOrTombstone) {
        if (creep.withdraw(buildingOrTombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(buildingOrTombstone);
        }           
    },
    pickUpDroppedEnergy: function(creep) {
        let droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (droppedEnergy != undefined) {
            return pickup(creep, droppedEnergy);
        } else {
            return false;
        }

        function pickup(creep, droppedEnergy) {
            if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy);
            }
            return true;
        }
    },
};
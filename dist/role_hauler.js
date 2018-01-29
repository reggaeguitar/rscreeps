var _ = require('lodash');
var worker = require('role_worker');

module.exports = {
    run: function(creep) {
        worker.run(creep, this.doWork);
    },
    doWork: function(creep) {
        const towerFillFactor = 0.90;
        // fill spawns and extensions first, then towers
        var nonFullSpawnsAndExtensions = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => ((s.structureType == STRUCTURE_SPAWN ||
                           s.structureType == STRUCTURE_EXTENSION)
                           && s.energy < s.energyCapacity)});
        var nonFullTower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_TOWER && 
                         s.energy < s.energyCapacity * towerFillFactor });
        var nonFullStorage = creep.room.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_STORAGE && 
                         _.sum(s.store) < s.storeCapacity });
        if (nonFullSpawnsAndExtension != undefined) {
            if (creep.transfer(nonFullSpawnsAndExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nonFullSpawnsAndExtension, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else if (nonFullTower != undefined) {
            if (creep.transfer(nonFullTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nonFullTower, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else if (nonFullStorage != undefined) {
            if (creep.transfer(nonFullStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nonFullStorage, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}
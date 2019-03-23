var _ = require('lodash');
var worker = require('role_worker');

module.exports = {
    run: function(creep) {
        worker.run(creep, this.doWork);
    },
    doWork: function(creep) {
        const towerFillFactor = 0.90;        
        // fill spawns and extensions first, then towers
        var nonFullSpawnOrExtension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => (s.room == creep.room &&
                          (s.structureType == STRUCTURE_SPAWN ||
                           s.structureType == STRUCTURE_EXTENSION)
                           && s.energy < s.energyCapacity)});
        var nonFullTower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.room == creep.room &&
                         s.structureType == STRUCTURE_TOWER && 
                         s.energy < s.energyCapacity * towerFillFactor });
        var nonFullStorage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.room == creep.room &&
                         s.structureType == STRUCTURE_STORAGE && 
                         _.sum(s.store) < s.storeCapacity });
        if (nonFullSpawnOrExtension != undefined) {
            if (creep.transfer(nonFullSpawnOrExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nonFullSpawnOrExtension, { visualizePathStyle: { stroke: '#ffffff' } });
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
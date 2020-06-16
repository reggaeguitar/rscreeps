const _ = require('lodash');
const worker = require('./role_worker');
const data = require('./data');

module.exports = {
    run: function(creep) {
        worker.run(creep, this.doWork);
    },
    doWork: function(creep) {
        // todo dry out this function        
        const towerFillFactor = 0.90;        
        const room = Game.rooms[creep.memory.homeRoom];
        // fill spawns and extensions first, then towers, then storage
        let nonFullSpawnOrExtension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (s.room == room &&
                          (s.structureType == STRUCTURE_SPAWN ||
                           s.structureType == STRUCTURE_EXTENSION)
                           && s.energy < s.energyCapacity)});
        let nonFullTower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => s.room == room &&
                         s.structureType == STRUCTURE_TOWER && 
                         s.energy < s.energyCapacity * towerFillFactor });
        let nonFullStorage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => s.room == room &&
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
var worker = require('worker');

module.exports = {
    run: function(creep) {
        worker.run(creep, this.doWork);
    },
    doWork: function(creep) {
        // fill spawns and extensions first, then towers
        var nonFullSpawnsAndExtensions = creep.room.find(FIND_STRUCTURES, {
            filter: s => {
                return ((s.structureType == STRUCTURE_SPAWN ||
                        s.structureType == STRUCTURE_EXTENSION)
                        && s.energy < s.energyCapacity);
            }
        });
        var nonFullTowers = creep.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_TOWER && 
                         s.energy < s.energyCapacity
        });
        if (nonFullSpawnsAndExtensions.length > 0) {
            if (creep.transfer(nonFullSpawnsAndExtensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nonFullSpawnsAndExtensions[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else if (nonFullTowers.length > 0) {
            if (creep.transfer(nonFullTowers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nonFullTowers[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}
var worker = require('role_worker');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        worker.run(creep, this.doWork);
    },
    doWork: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                // fill spawns, then extensions then towers
                return (structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_TOWER)
                        && structure.energy < structure.energyCapacity;
            }
        });
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};

var worker = require('role_worker');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        worker.run(creep, this.doWork);
    },
    doWork: function(creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            // just started working after procuring energy
            // todo this will get hit every tick until the creep actually spends
            // some energy, add more data to fix
            var rand = _.random(1);
            if (rand == 0) {
                creep.memory.repairing = true;
                creep.memory.building = false;
                repair();
            } else if (rand == 1) {
                creep.memory.repairing = false;
                creep.memory.building = true;
                build();
            }
        } else if (creep.memory.repairing) {
            repair();
        } else if (creep.memory.building) {
            build();
        } // if creep.carry.energy == 0 it will switch to harvest mode
        
        function repair() {
            var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: struc => struc.hits < struc.hitsMax
            });
            if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestDamagedStructure, 
                    { visualizePathStyle: {stroke: '#ffbb00' } });                
            }
        };
        function build() {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], 
                        { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        };
               
    }
};

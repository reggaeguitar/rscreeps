var worker = require('role_worker');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        worker.run(creep, this.doWork);
    },
    doWork: function(creep) {      
        if (!build()) {
            if (!repair()) {
                creep.memory.role = 'upgrader';
            }
        }

        function repair() {
            var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: struc => struc.hits < struc.hitsMax
            });
            if (closestDamagedStructure != undefined && 
                creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestDamagedStructure, 
                    { visualizePathStyle: {stroke: '#ffbb00' } });
                return true;           
            }
            return false;
        };
        function build() {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], 
                        { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return true;
            }
            return false;
        };               
    }
};

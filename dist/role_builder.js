var worker = require('role_worker');

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        worker.run(creep, this.doWork);
    },
    doWork: function(creep) {
        var repair = function() {
            var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: struc => struc.hits < struc.hitsMax
            });
            if (closestDamagedStructure) {
                creep.repair(closestDamagedStructure);
            }
        };
        var build = function() {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], 
                        { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        };
        var rand = _.random(1);
        if (rand == 0) {
            repair();
        } else if (rand == 1) {
            build();
        }       
    }
};

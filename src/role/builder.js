const roles = require('role_roles');
const worker = require('role_worker');

module.exports = {
    run: function(creep) {
        worker.run(creep, this.doWork);
    },
    doWork: function(creep) {      
        if (!build() && !repair()) {
            creep.memory.role = roles.RoleUpgrader;
        }

        function repair() {
            let closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
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
            // todo dry out this method
            let nonRoadTargets = creep.room.find(FIND_CONSTRUCTION_SITES)
                .filter(x => x.structureType != 'road');
            
            if (nonRoadTargets.length) {
                if (creep.build(nonRoadTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nonRoadTargets[0], 
                        { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return true;
            }

            let roadTargets = creep.room.find(FIND_CONSTRUCTION_SITES)
                .filter(x => x.structureType == 'road');
            if (roadTargets.length) {
                if (creep.build(roadTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(roadTargets[0], 
                        { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return true;
            }
            return false;            
        };               
    }
};

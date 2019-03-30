const roles = require('role_roles');
const worker = require('role_worker');
const util = require('util');

module.exports = {
    run: function(creep) {
        worker.run(creep, this.doWork);
    },
    doWork: function(creep) {
        // todo repair towers and other defense as top priority    
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
                .filter(x => x.structureType != STRUCTURE_ROAD);
            
            if (nonRoadTargets.length) {
                if (creep.build(nonRoadTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nonRoadTargets[0], 
                        { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return true;
            }

            let roadTargets = creep.room.find(FIND_CONSTRUCTION_SITES)
                .filter(x => x.structureType == STRUCTURE_ROAD);
            if (roadTargets.length) {
                if (creep.build(roadTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(roadTargets[0], 
                        { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return true;
            }
            // find spawns in new room to build
            let rooms = util.getRoomNames();
            for (let i = 0; i < rooms.length; ++i) {
                // todo make code work for when older rooms have two spawns
                // should only count spawns in brand new rooms
                let spawnTargets = r.find(FIND_CONSTRUCTION_SITES)
                    .filter(x => x.structureType == STRUCTURE_SPAWN);
                if (spawnTargets.length) {
                    if (creep.build(spawnTargets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawnTargets[0], 
                            { visualizePathStyle: { stroke: '#cccccc' } });
                    }
                    return true;
                }
            }
            return false;            
        };               
    }
};

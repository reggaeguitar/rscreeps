var _ = require('lodash');
var util = require('util');
var data = require('data');
var creepUtil = require('creepUtil');

module.exports = {
    run: function(room, spawn) {
        if (Object.keys(Game.creeps).length > 0) {
            this.transitionNeededHarvesters(spawn);
            this.transitionIdleHarvesters(room);
            this.rebalanceSourcesToMine(room);
            this.ensureAtLeastOneOfEachRole(room);
        }
    },
    ensureAtLeastOneOfEachRole: function(room) {
        var creepRoleCounts = util.getCreepRoleCounts();
        // todo finish
    },
    transitionNeededHarvesters: function(spawn) {
        // if there are no harvesters and
        // not max creep population and
        // not currently spawning a creep
        // then transition one
        if (!spawn.spawning) {        
            var harvesterCount = _.filter(Game.creeps, c => c.memory.role == 'harvester');
            var creepNames = Object.keys(Game.creeps);
            var creepCount = creepNames.length;
            var maxCreepCount = data.maxCreepCount;
            if (harvesterCount == 0 && creepCount < maxCreepCount) {
                var youngestCreep = Game.creeps[creepNames[creepNames.length - 1]];
                youngestCreep.memory.role = 'harvester';
            }
        }        
    },
    transitionIdleHarvesters: function(room) {
        // if creep count = maxCreepCount  and  
        // spawner and extensions are full change role
        // to a random role other than harvester     
        var roomHasMaxCreeps = util.getCreepCount() == data.maxCreepCount;
        var roomHasFullEnergy = room.energyAvailable == room.energyCapacityAvailable;
        var towersHaveFullEnergy = room.find(FIND_STRUCTURES, { filter: 
            s => s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity })
            .length == 0;
        if (roomHasMaxCreeps && roomHasFullEnergy && towersHaveFullEnergy) {
            for(var name in Game.creeps) {
                var creep = Game.creeps[name];
                if (creep.memory.role == 'harvester') {
                    var roles = util.getRoles();
                    var rolesOtherThanHarvester = _.pull(roles, 'harvester');
                    var newRole = rolesOtherThanHarvester[_.random(roles.length - 1)];
                    creep.memory.role = newRole;
                }
            }
        }
    },
    rebalanceSourcesToMine: function(room) {
        // count how many creeps are currently harvesting
        // if more than or equal to the number of sources
        // if a source does not have any assigned
        // then transition one (preferably the furtherst away from it)
        var creepsHarvestingInRoom = _.filter(Game.creeps, c => 
            c.room.name == room.name && c.memory.harvesting);
        var sources = room.find(FIND_SOURCES);
        if (creepsHarvestingInRoom.length >= sources.length) {
            var sourcesBeingHarvested = 
                _.countBy(_.filter(Game.creeps, c => c.memory.harvesting), 
                    cr => cr.memory.sourceToHarvest);
            var reassigned = false;
            for (var source in sources) {                
                if (!reassigned && !sourcesBeingHarvested.hasOwnProperty(source)) { 
                    // no creeps assigned to harvest this source
                    var creepToReassign = _.filter(creepsHarvestingInRoom, 
                        c => c.memory.sourceToHarvest != source)[0];
                    var curAssignedSource = creepToReassign.memory.sourceToHarvest;
                    creepToReassign.memory.sourceToHarvest = curAssignedSource == 0 ? 1 : 0;  
                    reassigned = true;
                    break;
                }
            }           
        }
    },

}
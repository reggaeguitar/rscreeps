var _ = require('lodash');
var util = require('util');
var data = require('data');

module.exports = {
    run: function(room, spawn) {
        this.transitionNeededHarvesters(spawn);
        this.transitionIdleHarvesters();
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
    transitionIdleHarvesters: function() {
        // if creep count = maxCreepCount  and  
        // spawner and extensions are full change role
        // to a random role other than harvester     
        var roomHasMaxCreeps = util.getCreepCount() == data.maxCreepCount;
        var roomHasFullEnergy = room.energyAvailable == room.energyCapacityAvailable;
        if (roomHasMaxCreeps && roomHasFullEnergy) {
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
}
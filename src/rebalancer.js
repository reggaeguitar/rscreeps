var _ = require('lodash');
var util = require('util');

module.exports = {
    run: function(room) {
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
                    var newRole = roles[_.random(roles.length - 1)];
                    while (newRole == 'harvester') {
                        newRole = roles[_.random(roles.length - 1)];
                    }
                    creep.memory.role = newRole;
                }
            }
        }
    }
}
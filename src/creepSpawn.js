var util = require('util');

module.exports = {    
    run: function(room, spawn) {
        var creepRoleCounts = util.getCreepRoleCounts();
        if (creepRoleCounts['harvester'] > 0) {
            this.spawnCreepIfPossible(room, spawn);
        } else {
            var cheapestHarvester = [WORK, MOVE, CARRY];
            this.spawnCreepImpl(cheapestHarvester, 'harvester', spawn);
        }
    },
    spawnCreepIfPossible: function(room, spawn) {
        var bodyParts = [WORK, WORK, CARRY, MOVE, MOVE, MOVE];
        var costForCreep = this.creepCost(bodyParts);
        //console.log('costForCreep: ' + costForCreep);
        if (costForCreep > room.energyCapacityAvailable) {
            console.log('Error: body parts cost too much for spawner. ');
        }
        //console.log(creepData.keys.length);
        //console.log(costForCreep);
        if (spawn.energy >= costForCreep) {
            var role = roles[_.random(roles.length - 1)];
            var harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
            if (harvesterCount <= 1) {
                role = 'harvester';
            }
            spawnCreepImpl(bodyParts, role);
        }
    },
    spawnCreepImpl: function(bodyParts, role, spawn) {
        var ret = spawn.spawnCreep(bodyParts, Game.time, { memory: { role: role } });
        if (ret != OK) {
            console.log('could not spawn creep: ' + JSON.stringify(ret));
        }
    },
    creepCost: function(bodyParts) {
        var totalCost = 0;
        for (var i = 0; i < bodyParts.length; ++i) {
            var priceForPart = BODYPART_COST[bodyParts[i]];
            totalCost += priceForPart;
        }
        return totalCost;
    },    
};
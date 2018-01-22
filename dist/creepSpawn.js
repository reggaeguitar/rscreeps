var util = require('util');
var data = require('data');

module.exports = {    
    run: function(room, spawn) {
        var maxCreepCount = 4; // sourceCount * 2
        var creepCount = Object.keys(Game.creeps).length;
        if (creepCount < maxCreepCount) {
            var creepRoleCounts = util.getCreepRoleCounts();        
            if (creepRoleCounts['harvester'] > 0) {
                this.spawnCreepIfPossible(room, spawn);
            } else {
                var cheapestHarvester = [WORK, MOVE, CARRY];
                this.spawnCreepImpl(cheapestHarvester, 'harvester', spawn);
            }
        }
    },
    spawnCreepIfPossible: function(room, spawn) {
        if (spawn.spawning) {
            return;
        }
        var bodyParts = [WORK, WORK, WORK, CARRY, MOVE, MOVE];
        var costForCreep = this.creepCost(bodyParts);
        //console.log('costForCreep: ' + costForCreep);
        if (costForCreep > room.energyCapacityAvailable) {
            console.log('Error: body parts cost too much for spawner and extensions.');
        }
        //console.log(creepData.keys.length);
        //console.log(costForCreep);
        if (room.energyAvailable >= costForCreep) {
            var roles = Object.keys(data.creepData);
            var role = roles[_.random(roles.length - 1)];
            var harvesterCount = _.filter(Game.creeps, cr => cr.memory.role == 'harvester').length;
            if (harvesterCount <= 1) {
                role = 'harvester';
            }
            this.spawnCreepImpl(bodyParts, role, spawn);
        }
    },
    spawnCreepImpl: function(bodyParts, role, spawn) {
        var ret = spawn.spawnCreep(bodyParts, role + Game.time, { memory: { role: role } });
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
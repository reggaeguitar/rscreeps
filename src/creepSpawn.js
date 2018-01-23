var util = require('util');
var data = require('data');

module.exports = {    
    run: function(room, spawn) {
        if (util.getCreepCount() < data.maxCreepCount) {
            this.spawnCreepIfPossible(room, spawn);
        }
    },
    spawnCreepIfPossible: function(room, spawn) {
        if (spawn.spawning) {
            return;
        }
        var bodyParts = [WORK, WORK, CARRY, MOVE, MOVE];
        var costForCreep = this.creepCost(bodyParts);
        if (costForCreep > room.energyCapacityAvailable) {
            console.log('Error: body parts cost too much for spawner and extensions.');
        }
        if (room.energyAvailable >= costForCreep) {
            var roles = util.getRoles();
            var role = roles[_.random(roles.length - 1)];            
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
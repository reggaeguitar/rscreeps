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
        if (this.canAffordGoodCreep(room)) {
            var bodyParts = this.getBodyParts(room);
            var roles = util.getRoles();
            var role = roles[_.random(roles.length - 1)];            
            this.spawnCreepImpl(bodyParts, role, spawn);
        }
    },
    canAffordGoodCreep: function(room) {
        var curEnergy = room.energyAvailable;
        var maxEnergy = room.energyCapacityAvailable;
        if (maxEnergy - curEnergy <= 100) {
            return true;
        }
        return false;
    },
    getBodyParts: function(room) {
        const priceForCarryAndMove = 100;
        const priceForWork = 100;
        var maxPrice = room.energyAvailable;
        var carryAndMoveCount = room.controller.level;
        var energyForWorkParts = (maxPrice - (priceForCarryAndMove * carryAndMoveCount));
        var workCount = energyForWorkParts / priceForWork;
        var ret = [];
        for (let i = 0; i < workCount; i++) {
            ret.push[WORK];
        }
        for (let j = 0; j < carryAndMoveCount; j++) {
            ret.push[CARRY];
            ret.push[MOVE];
        }
        return ret;
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
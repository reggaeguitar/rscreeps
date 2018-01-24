var util = require('util');
var data = require('data');

module.exports = {    
    run: function(room, spawn) {
        if (spawn.spawning) {
            return;
        }  
        var curCreepCount = util.getCreepCount();
        var maxCount = data.maxCreepCount;
        var missing = maxCount - curCreepCount;
        if (missing > 1) {
            this.spawnBestHarvesterPossible(room, spawn);
        } else if (util.getCreepCount() < data.maxCreepCount) {
            this.spawnGoodCreep(room, spawn);
        }
    },    
    spawnBestHarvesterPossible: function(room, spawn) {
        var energyAvailable = room.energyAvailable;
        if (energyAvailable < 200) {
            console.log('spawn has less than 200 energy, can\'t spawn creep');
            return;
        }
        var half = energyAvailable / 2;
        var workCount = half / BODYPART_COST[WORK];
        if (BODYPART_COST[MOVE] != BODYPART_COST[CARRY]) {
            console.log('MOVE and CARRY no longer the same cost, update creepSpawn.js');
        }
        var carryAndMoveCount = half / BODYPART_COST[MOVE];
        var bodyParts = getBodyPartsFromCounts(
            workCount, carryAndMoveCount, carryAndMoveCount);
        this.spawnCreepImpl(bodyParts, 'harvester', spawn);
    },
    spawnGoodCreep: function(room, spawn) {              
        if (this.canAffordGoodCreep(room)) {
            var bodyParts = this.getBodyParts(room);
            var roles = util.getRoles();
            var role = roles[_.random(roles.length - 1)];            
            this.spawnCreepImpl(bodyParts, role, spawn);
        }
    },
    getBodyPartsFromCounts: function(workCount, carryCount, moveCount) {
        var ret = [];
        for (let i = 0; i < workCount; i++) {
            ret.push(WORK);
        }
        for (let i = 0; i < carryCount; i++) {
            ret.push(CARRY);
        }
        for (let i = 0; i < moveCount; i++) {
            ret.push(MOVE);
        }
        return ret;
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
        // need to pass an object to work on bodyParts by reference
        var arg = { bodyParts: [] };
        this.addBodyParts(arg, WORK, workCount);
        this.addBodyParts(arg, CARRY, carryAndMoveCount);
        this.addBodyParts(arg, MOVE, carryAndMoveCount);       
        return arg.bodyParts;
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
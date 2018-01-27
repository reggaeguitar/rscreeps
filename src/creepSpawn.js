var _ = require('lodash');
var util = require('util');
var data = require('data');

module.exports = {    
    run: function(room, spawn) {
        if (spawn.spawning) {
            return;
        }
        var energyAvailable = room.energyAvailable;
        //console.log(energyAvailable);
        if (energyAvailable < 200) {
            console.log('room has less than 200 energy, can\'t spawn creep');
            return;
        }
        var creepCountsByRole = util.getCreepRoleCounts();
        var maxHarvesterCount = data.maxHarvesterCount;
        console.log(JSON.stringify(creepCountsByRole));
        if (!creepCountsByRole.hasOwnProperty('harvester') || creepCountsByRole['harvester'] < maxHarvesterCount) {
            this.spawnBestHarvesterPossible(room, spawn);
        } else {
            var maxWorkerCount = data.maxWorkerCount;
            // todo loop over roles
            if (creepCountsByRole.hasOwnProperty('harvester')) {
                var workerCount = Object.keys(Game.creeps).length - creepCountsByRole['harvester'];
                console.log(workerCount);
                if (workerCount < maxWorkerCount) {
                    var rand = _.random(1);
                    this.spawnBestWorkerPossible(room, spawn, rand == 1 ? 'hauler' : 'upgrader');
                }
            }
        }
    }, 
    spawnBestHarvesterPossible: function(room, spawn) {
        console.log('spawnBestHarvesterPossible called');
        var moveCount = room.controller.level;
        var movePartsCost = BODYPART_COST[MOVE] * moveCount;
        var energyLeftForWorkParts = room.energyAvailable - movePartsCost;
        var workCount = energyLeftForWorkParts / BODYPART_COST[WORK];
        console.log('workCount: ' + workCount);
        var bodyParts = this.getBodyPartsFromCounts(workCount, 0, moveCount);
        this.spawnCreepImpl(bodyParts, 'harvester', spawn);
    },
    spawnBestWorkerPossible: function(room, spawn, role) {
        var half = room.energyAvailable / 2;
        var workCount = half / BODYPART_COST[WORK];
        if (BODYPART_COST[MOVE] != BODYPART_COST[CARRY]) {
            console.log('MOVE and CARRY no longer the same cost, update creepSpawn.js');
        }
        var carryAndMoveCount = (half / BODYPART_COST[MOVE]) / 2;
        var bodyParts = this.getBodyPartsFromCounts(
            workCount, carryAndMoveCount, carryAndMoveCount);
        if (this.creepCost(bodyParts) > room.energyAvailable) {
            console.log('error in creepSpawn, bodyParts: ' + JSON.stringify(bodyParts) 
                + ' cost more than energyAvailable: ' + room.energyAvailable);
        }
        this.spawnCreepImpl(bodyParts, role, spawn);
    },
    getBodyPartsFromCounts: function(workCount, carryCount, moveCount) {
        var ret = [];
        for (let i = 0; i < Math.floor(workCount); i++) {
            ret.push(WORK);
        }
        for (let i = 0; i < Math.floor(carryCount); i++) {
            ret.push(CARRY);
        }
        for (let i = 0; i < Math.floor(moveCount); i++) {
            ret.push(MOVE);
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
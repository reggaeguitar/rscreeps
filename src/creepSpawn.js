const _ = require('lodash');
const util = require('util');
const data = require('data');

module.exports = {    
    run: function(room, spawn) {
        if (spawn.spawning) {
            return;
        }
       
        let energyAvailable = room.energyAvailable;
        const cheapestCreepCost = 200;
        if (energyAvailable < cheapestCreepCost) {
            console.log('room has less than ' + cheapestCreepCost + ' energy, can\'t spawn creep');
            return;
        }
        let creepCountsByRole = util.getCreepRoleCounts();
        let maxHarvesterCount = data.maxHarvesterCount;
        let zeroHarvesters = !creepCountsByRole.hasOwnProperty('harvester');
        let lessThanMaxHarvesters = creepCountsByRole['harvester'] < maxHarvesterCount;
        let potentialHarvestersAboutToDie = _.filter(Game.creeps, c => c.memory.role == 'harvester' && 
            c.ticksToLive < data.harvesterTicksToLive);
        let harvesterAboutToDie = potentialHarvestersAboutToDie != undefined &&
            potentialHarvestersAboutToDie.length > 0;
        if (zeroHarvesters || lessThanMaxHarvesters || harvesterAboutToDie) {            
            let canWaitToSpawnGoodHarvester = creepCountsByRole.hasOwnProperty('hauler') &&
                                              creepCountsByRole.hasOwnProperty('harvester');
            if (canWaitToSpawnGoodHarvester) {
                this.trySpawnGoodHarvester(room, spawn);
            } else {
                this.spawnBestHarvesterPossible(room, spawn);
            }
        } else {
            let maxWorkerCount = data.maxWorkerCount;
            // todo loop over roles
            if (creepCountsByRole.hasOwnProperty('harvester')) {
                let workerCount = Object.keys(Game.creeps).length - creepCountsByRole['harvester'];
                console.log('workerCount: ' + workerCount + ' maxWorkerCount: ' + maxWorkerCount);
                if (workerCount < maxWorkerCount) {
                    let role = this.getWorkerRole(room, creepCountsByRole);
                    this.spawnBestWorkerPossible(room, spawn, role);
                }
            }
        }
    },
    getWorkerRole: function(room, creepCountsByRole) {
        let needHauler = !creepCountsByRole.hasOwnProperty('hauler') || creepCountsByRole['hauler'] < data.minHaulerCount;
        let needBuilder = false;
        _.forOwn(Game.constructionSites, (v, k) => { if (v.room == room) { needBuilder = true; } });
        if (needHauler) {
            return 'hauler';
        } else if (needHauler) {
            return 'builder';            
        } else {
            return 'upgrader';
        }
    },
    trySpawnGoodHarvester: function(room, spawn) {
        let moveCount = this.getHarvesterMoveCount(room);
        let movePartsCost = BODYPART_COST[MOVE] * moveCount;
        let energyLeftForWorkParts = room.energyAvailable - movePartsCost;
        let workCount = energyLeftForWorkParts / BODYPART_COST[WORK];
        if (workCount >= data.goodHarvesterWorkCount) {
            let bodyParts = this.getBodyPartsFromCounts(data.goodHarvesterWorkCount, 0, moveCount);
            this.spawnCreepImpl(bodyParts, 'harvester', spawn);
        }
    },
    spawnBestHarvesterPossible: function(room, spawn) {
        console.log('spawnBestHarvesterPossible called');
        let moveCount = this.getHarvesterMoveCount(room);
        let movePartsCost = BODYPART_COST[MOVE] * moveCount;
        let energyLeftForWorkParts = room.energyAvailable - movePartsCost;
        let workCount = energyLeftForWorkParts / BODYPART_COST[WORK];
        if (workCount > data.goodHarvesterWorkCount) {
            workCount = data.goodHarvesterWorkCount;
        }
        if (workCount == 0) {
            return;
        }
        console.log('workCount: ' + workCount);
        let bodyParts = this.getBodyPartsFromCounts(workCount, 0, moveCount);
        this.spawnCreepImpl(bodyParts, 'harvester', spawn);
    },
    getHarvesterMoveCount: function(room) {
        return data.harvesterMoveCount;
    },
    spawnBestWorkerPossible: function(room, spawn, role) {
        let half = room.energyAvailable / 2;
        let workCount = half / BODYPART_COST[WORK];
        if (BODYPART_COST[MOVE] != BODYPART_COST[CARRY]) {
            console.log('MOVE and CARRY no longer the same cost, update creepSpawn.js');
        }
        if (workCount == 0) {
            return;
        }
        let carryAndMoveCount = (half / BODYPART_COST[MOVE]) / 2;
        let bodyParts = this.getBodyPartsFromCounts(
            workCount, carryAndMoveCount, carryAndMoveCount);
        if (this.creepCost(bodyParts) > room.energyAvailable) {
            console.log('error in creepSpawn, bodyParts: ' + JSON.stringify(bodyParts) 
                + ' cost more than energyAvailable: ' + room.energyAvailable);
        }
        this.spawnCreepImpl(bodyParts, role, spawn);
    },
    getBodyPartsFromCounts: function(workCount, carryCount, moveCount) {
        let ret = [];
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
        let ret = spawn.spawnCreep(bodyParts, role + Game.time, { memory: { role: role } });
        if (ret != OK) {
            console.log('could not spawn creep: ' + JSON.stringify(ret));
        }
    },
    creepCost: function(bodyParts) {
        let totalCost = 0;
        for (let i = 0; i < bodyParts.length; ++i) {
            let priceForPart = BODYPART_COST[bodyParts[i]];
            totalCost += priceForPart;
        }
        return totalCost;
    },    
};
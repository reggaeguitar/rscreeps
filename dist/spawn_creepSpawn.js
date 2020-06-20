const _ = require('lodash');
const util = require('./util');
const data = require('./data');
const roles = require('./role_roles');
const roomMemory = require('./roomExpansion_roomMemory');
const logger = require('./logger');
const harvesterSpawn = require('./spawn_harvesterSpawn');
const spawnUtil = require('./spawn_spawnUtil');
const maxWorkerCount = require('./services_maxWorkerCount');

module.exports = {    
    run: function(room, spawn) {
        if (spawn.spawning) return false;
        const creepCountsByRole = util.getCreepRoleCounts();
        if (this.notEnoughEnergyToSpawnCreep(room)) return false;
        
        if (this.shouldSpawnHarvester(room, creepCountsByRole)) {
            harvesterSpawn.spawnHarvester(room, spawn, creepCountsByRole);
            return true;
        } else if (this.spawnedScout(room, spawn, creepCountsByRole)) {
            return true;
        } else if (this.spawnedClaimer(room, spawn, creepCountsByRole)) {
            return true;
        } else {
            this.spawnWorker(room, spawn, creepCountsByRole);
            return true;
        }
    },
    spawnWorker: function(room, spawn, creepCountsByRole) {
        const maxWorkerCountInRoom = maxWorkerCount.maxWorkerCount(room, creepCountsByRole);
        let hasALotOfEnergyInSpawnAndExtensions = room.energyAvailable >= (room.energyCapacityAvailable * 0.9);
        if (creepCountsByRole.hasOwnProperty(roles.RoleHarvester)) {
            const workerCount = util.workerCount(room.name, creepCountsByRole);
            let potentialStorage = _.filter(room.find(FIND_MY_STRUCTURES), s => s.structureType == STRUCTURE_STORAGE);
            let hasStoredEnergy = potentialStorage.length > 0 && 
            potentialStorage[0].store[RESOURCE_ENERGY] > (room.controller.level * 400);
            let shouldSpawnCreep = (hasALotOfEnergyInSpawnAndExtensions && hasStoredEnergy)
            || workerCount < maxWorkerCountInRoom;
            
            logger.log('in spawnWorker ', { workerCount, maxWorkerCountInRoom, shouldSpawnCreep });

            if (shouldSpawnCreep) {
                let role = this.getWorkerRole(room, creepCountsByRole);
                this.spawnBestWorkerPossible(room.energyAvailable, spawn, role);
            }
        }
    },
    shouldSpawnHarvester: function(room, creepCountsByRole) {
        let maxHarvesterCount = data.maxHarvesterCount(room);
        let haveZeroHarvesters = !creepCountsByRole.hasOwnProperty(roles.RoleHarvester);
        let lessThanMaxHarvesters = creepCountsByRole[roles.RoleHarvester] < maxHarvesterCount;
        let potentialHarvestersAboutToDie = _.filter(Game.creeps, 
            c => c.memory.role == roles.RoleHarvester && 
                 c.ticksToLive < data.harvesterTicksToLive(room));
        let harvesterAboutToDie = potentialHarvestersAboutToDie != undefined &&
            potentialHarvestersAboutToDie.length > 0;
        // perf cache source count for each room in Memory
        let harvesterCountLessThanSourceCount = 
            creepCountsByRole[roles.RoleHarvester] <= room.find(FIND_SOURCES).length;
        let ret = haveZeroHarvesters || lessThanMaxHarvesters || 
            (harvesterAboutToDie && harvesterCountLessThanSourceCount);
        logger.log('in shouldSpawnHarvester', { ret, haveZeroHarvesters, 
            lessThanMaxHarvesters, harvesterAboutToDie, harvesterCountLessThanSourceCount})
        // logger.email(message);
        return ret;
    },   
    getWorkerRole: function(room, creepCountsByRole) {
        const needHauler = !creepCountsByRole.hasOwnProperty(roles.RoleHauler) || 
            creepCountsByRole[roles.RoleHauler] < data.minHaulerCount(room);
        let needBuilder = false;        
        _.forOwn(Game.constructionSites, (v, k) => { if (v.room == room) { needBuilder = true; } });
        const haveAtLeastOneHauler = creepCountsByRole.hasOwnProperty(roles.RoleUpgrader);
        const needUgrader = creepCountsByRole.hasOwnProperty(roles.RoleUpgrader) == false;
        if (needHauler) {
            return roles.RoleHauler;
        } else if (needUgrader) {
            return roles.RoleUpgrader;
        } else if (needBuilder && haveAtLeastOneHauler) {
            return roles.RoleBuilder;
        } else {
            return roles.RoleUpgrader;
        }
    },
    spawnBestWorkerPossible: function(energyAvailable, spawn, role) {
        // need half the energy for work and half for move and/or carry
        // work part costs double what move and carry cost (100 vs 50 currently)
        energyAvailable = energyAvailable / 2;       
        let workCount = energyAvailable / BODYPART_COST[WORK];
        if (BODYPART_COST[MOVE] != BODYPART_COST[CARRY]) {
            logger.log('MOVE and CARRY no longer the same cost, update creepSpawn.js');
        }
        if (workCount == 0) return;

        let carryAndMoveCount = (energyAvailable / BODYPART_COST[MOVE]) / 2;
        workCount = role != roles.RoleHauler ? workCount : 0;
        let bodyParts = spawnUtil.getBodyPartsFromCounts(
            workCount, carryAndMoveCount, carryAndMoveCount);
        if (spawnUtil.creepCost(bodyParts) > energyAvailable) {
            logger.log('error in creepSpawn, bodyParts: ' + JSON.stringify(bodyParts) 
                + ' cost more than energyAvailable: ' + energyAvailable);
        }
        spawnUtil.spawnCreepImpl(bodyParts, role, spawn);
    },
    spawnedClaimer: function(room, spawn, creepCountsByRole) {
        // todo add logic so that only the closest room
        // next to the room to claim will spawn the claimer
        // only want one claimer at a time
        if (creepCountsByRole.hasOwnProperty[roles.RoleClaimer]) return false;
        if (!roomMemory.roomToClaim()) return false;
        const claimCost = 600;
        if (BODYPART_COST[CLAIM] != claimCost) {
            logger.log('Claim bodypart no longer costs 600 energy, update creepSpawn.js');
        }
        let bodyParts = [CLAIM];
        let movePartCount = ((room.energyAvailable - claimCost) / BODYPART_COST[MOVE]) - 1;
        if (movePartCount == 0) {
            logger.log('Not enough energy to spawn claimer');
            return true;
        }
        for (let i = 0; i < movePartCount; ++i) {
            bodyParts.push(MOVE);
        }
        const roomToClaim = roomMemory.roomToClaim();
        spawnUtil.spawnCreepImpl(bodyParts, roles.RoleClaimer, spawn, roomToClaim);
        return true;
    },
    spawnedScout: function(room, spawn, creepCountsByRole) {
        // only want one scout at a time
        if (creepCountsByRole.hasOwnProperty(roles.RoleScout)) return false;
        const roomsToScout = roomMemory.roomsToScout();
        if (!roomsToScout || roomsToScout.length == 0) return false;
        const moveCost = BODYPART_COST[MOVE];
        if (room.energyAvailable < moveCost) {
            logger.log('Not enough energy to spawn scout');
            return true;
        }
        let energyAvailable = room.energyAvailable;
        let moveCount = 0;
        const maxMoveParts = 5;
        const bodyParts = [];
        while (energyAvailable > moveCost && moveCount < maxMoveParts) {
            energyAvailable -= moveCost;
            moveCount += 1;
            bodyParts.push(MOVE);
        }
        spawnUtil.spawnCreepImpl(bodyParts, roles.RoleScout, spawn, roomsToScout[0]);
        return true;        
    },
    notEnoughEnergyToSpawnCreep: function(room) {
        let energyAvailable = room.energyAvailable;
        const cheapestCreepCost = data.cheapestCreepCost(room);
        if (energyAvailable < cheapestCreepCost) {
            let message = 'room has less than ' + cheapestCreepCost + ' energy ' + 
            room.energyAvailable + ', can\'t spawn creep';
            logger.log(message);            
            return true;
        }
    }
};
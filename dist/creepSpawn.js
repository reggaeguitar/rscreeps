const _ = require('lodash');
const util = require('util');
const data = require('data');
const roles = require('role_roles');
const roomPicker = require('roomExpansion_roomPicker');
const logger = require('logger');

module.exports = {    
    run: function(room, spawn) {
        if (spawn.spawning) return;
        //if (this.spawnedClaimer(room, spawn)) return;
        if (this.notEnoughEnergyToSpawnCreep(room)) return;
        let creepCountsByRole = util.getCreepRoleCounts();    
        if (this.shouldSpawnHarvester(room, creepCountsByRole)) {
            this.spawnHarvester(room, spawn, creepCountsByRole);
        } else {
            let maxWorkerCount = data.maxWorkerCount(room);
            let hasALotOfEnergyInSpawnAndExtensions = room.energyAvailable >= (room.energyCapacityAvailable * 0.9);
            if (creepCountsByRole.hasOwnProperty(roles.RoleHarvester)) {
                let creepsInRoom = _.filter(Game.creeps, c => c.room.name == room.name);
                let workerCount = Object.keys(creepsInRoom).length - creepCountsByRole[roles.RoleHarvester];

                logger.log('workerCount: ' + workerCount + ' maxWorkerCount: ' + maxWorkerCount);
                let potentialStorage = _.filter(room.find(FIND_MY_STRUCTURES), s => s.structureType == STRUCTURE_STORAGE);
                let hasStoredEnergy = potentialStorage.length > 0 && 
                    potentialStorage[0].store[RESOURCE_ENERGY] > (room.controller.level * 400);
                let shouldSpawnCreep = (hasALotOfEnergyInSpawnAndExtensions && hasStoredEnergy)
                    || workerCount < maxWorkerCount;
                if (shouldSpawnCreep) {
                    let role = this.getWorkerRole(room, creepCountsByRole);
                    this.spawnBestWorkerPossible(room, spawn, role);
                }
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
        let message = 'shouldSpawnHarvester returned true\r\n' +
            ' haveZeroHarvesters: ' + haveZeroHarvesters +
            ' lessThanMaxHarvesters: ' + lessThanMaxHarvesters +
            ' harvesterAboutToDie: ' + harvesterAboutToDie +
            ' harvesterCountLessThanSourceCount: ' + harvesterCountLessThanSourceCount;
        logger.log(message);
        // logger.email(message);
        return ret;
    },
    spawnHarvester: function(room, spawn, creepCountsByRole) {
        let canWaitToSpawnGoodHarvester = 
            creepCountsByRole.hasOwnProperty(roles.RoleHauler) &&
            creepCountsByRole.hasOwnProperty(roles.RoleHarvester);
        logger.log('in spawnHarvester canWaitToSpawnGoodHarvester: ' + canWaitToSpawnGoodHarvester);
        if (canWaitToSpawnGoodHarvester) {
            this.trySpawnGoodHarvester(room, spawn);
        } else {
            this.spawnBestHarvesterPossible(room, spawn);
        }
    },
    getWorkerRole: function(room, creepCountsByRole) {
        let hauler = roles.RoleHauler;
        let needHauler = !creepCountsByRole.hasOwnProperty(hauler) || 
            creepCountsByRole[hauler] < data.minHaulerCount(room);
        let needBuilder = false;        
        _.forOwn(Game.constructionSites, (v, k) => { if (v.room == room) { needBuilder = true; } });
        let haveAtLeastOnHauler = creepCountsByRole.hasOwnProperty(roles.RoleUpgrader);
        if (needHauler) {
            return roles.RoleHauler;
        } else if (needBuilder && haveAtLeastOnHauler) {
            return roles.RoleBuilder;
        } else {
            return roles.RoleUpgrader;
        }
    },
    trySpawnGoodHarvester: function(room, spawn) {
        const moveCount = this.getHarvesterMoveCount(room);
        const movePartsCost = BODYPART_COST[MOVE] * moveCount;
        const energyLeftForWorkParts = room.energyAvailable - movePartsCost;
        const workCount = energyLeftForWorkParts / BODYPART_COST[WORK];
        const goodHarvesterWorkCount = data.goodHarvesterWorkCount(room);
        const logObject = { moveCount, movePartsCost, energyLeftForWorkParts, workCount, goodHarvesterWorkCount };
        logger.log('in trySpawnGoodHarvester ' + JSON.stringify(logObject));
        // {"moveCount":1,"movePartsCost":50,"energyLeftForWorkParts":250,"workCount":2.5,"goodHarvesterWorkCount":3}
        if (workCount >= goodHarvesterWorkCount) {
            let bodyParts = this.getBodyPartsFromCounts(goodHarvesterWorkCount, 0, moveCount);
            this.spawnCreepImpl(bodyParts, roles.RoleHarvester, spawn);
        }
    },
    spawnBestHarvesterPossible: function(room, spawn) {
        logger.log('spawnBestHarvesterPossible called');
        let moveCount = this.getHarvesterMoveCount(room);
        let movePartsCost = BODYPART_COST[MOVE] * moveCount;
        let energyLeftForWorkParts = room.energyAvailable - movePartsCost;
        let workCount = energyLeftForWorkParts / BODYPART_COST[WORK];
        if (workCount > data.goodHarvesterWorkCount(room)) {
            workCount = data.goodHarvesterWorkCount(room);
        }
        if (workCount == 0) {
            return;
        }
        logger.log('workCount: ' + workCount);
        let bodyParts = this.getBodyPartsFromCounts(workCount, 0, moveCount);
        this.spawnCreepImpl(bodyParts, roles.RoleHarvester, spawn);
    },
    getHarvesterMoveCount: room => data.harvesterMoveCount(room),
    spawnBestWorkerPossible: function(room, spawn, role) {
        let half = room.energyAvailable / 2;
        let workCount = half / BODYPART_COST[WORK];
        if (BODYPART_COST[MOVE] != BODYPART_COST[CARRY]) {
            logger.log('MOVE and CARRY no longer the same cost, update creepSpawn.js');
        }
        if (workCount == 0) return;

        let carryAndMoveCount = (half / BODYPART_COST[MOVE]) / 2;
        workCount = role != roles.RoleHauler ? workCount : 0;
        let bodyParts = this.getBodyPartsFromCounts(
            workCount, carryAndMoveCount, carryAndMoveCount);
        if (this.creepCost(bodyParts) > room.energyAvailable) {
            logger.log('error in creepSpawn, bodyParts: ' + JSON.stringify(bodyParts) 
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
    spawnCreepImpl: function(bodyParts, role, spawn, roomToClaim) {
        const memoryObj = { memory: { role: role } };
        if (roomToClaim != undefined) {
            memoryObj.memory.roomToClaim = roomToClaim;
        }
        const logObject = { bodyParts, spawnEnergy: spawn.store[RESOURCE_ENERGY] };
        logger.log('in spawnCreepImpl', logObject);
        if (bodyParts.length == 0) return;
        const ret = spawn.spawnCreep(bodyParts, role + Game.time, memoryObj);
        if (ret != OK) {
            logger.log('could not spawn creep: ', ret);
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
    spawnedClaimer: function(room, spawn) {
        // todo add logic so that only the closest room
        // next to the room to claim will spawn the claimer
        const claimCost = 600;
        if (util.getRoomNames().length < Game.gcl.level) {
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
            let rooms = util.getRoomNames();
            let roomToClaim = roomPicker.bestRoomNameNearExistingRooms(rooms);
            this.spawnCreepImpl(bodyParts, roles.RoleClaimer, spawn, roomToClaim);
            return true;
        }
        return false;
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
const _ = require('lodash');
const util = require('util');
const data = require('data');
const roles = require('role_roles');
const roomPicker = require('roomExpansion_roomPicker');

module.exports = {    
    run: function(room, spawn) {
        if (spawn.spawning) return;
        if (this.spawnedClaimer(room, spawn)) return;
        let energyAvailable = room.energyAvailable;
        const cheapestCreepCost = 200;
        if (energyAvailable < cheapestCreepCost) {
            if (data.log) console.log('room has less than ' + cheapestCreepCost + ' energy ' + 
                room.energyAvailable + ', can\'t spawn creep');
            return;
        }
        let creepCountsByRole = util.getCreepRoleCounts();
        let maxHarvesterCount = data.maxHarvesterCount(room);
        let haveZeroHarvesters = !creepCountsByRole.hasOwnProperty(roles.RoleHarvester);
        let lessThanMaxHarvesters = creepCountsByRole[roles.RoleHarvester] < maxHarvesterCount;
        let potentialHarvestersAboutToDie = _.filter(Game.creeps, 
            c => c.memory.role == roles.RoleHarvester && 
                 c.ticksToLive < data.harvesterTicksToLive(room));
        let harvesterAboutToDie = potentialHarvestersAboutToDie != undefined &&
            potentialHarvestersAboutToDie.length > 0;
        if (haveZeroHarvesters || lessThanMaxHarvesters || harvesterAboutToDie) {            
            this.spawnHarvester(room, spawn, creepCountsByRole);
        } else {
            let maxWorkerCount = data.maxWorkerCount(room);
            let hasALotOfEnergy = room.energyAvailable >= (room.energyCapacityAvailable * 0.9);
            // todo make this room independent
            if (creepCountsByRole.hasOwnProperty(roles.RoleHarvester)) {
                let creepsInRoom = _.filter(Game.creeps, c => c.room.name == room.name);
                let workerCount = Object.keys(creepsInRoom).length - creepCountsByRole[roles.RoleHarvester];
                if (data.log) console.log('workerCount: ' + workerCount + ' maxWorkerCount: ' + maxWorkerCount);
                let potentialStorage = room.find(STRUCTURE_STORAGE);
                let hasStoredEnergy = potentialStorage.length > 0 && 
                    potentialStorage[0].store > (room.controller.level * 200);
                let shouldSpawnCreep = (hasALotOfEnergy && hasStoredEnergy)
                    || workerCount < maxWorkerCount;
                if (shouldSpawnCreep) {
                    let role = this.getWorkerRole(room, creepCountsByRole);
                    this.spawnBestWorkerPossible(room, spawn, role);
                }
            }
        }
    },
    spawnHarvester: function(room, spawn, creepCountsByRole) {
        let canWaitToSpawnGoodHarvester = 
            creepCountsByRole.hasOwnProperty(roles.RoleHauler) &&
            creepCountsByRole.hasOwnProperty(roles.RoleHarvester);
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
        let moveCount = this.getHarvesterMoveCount(room);
        let movePartsCost = BODYPART_COST[MOVE] * moveCount;
        let energyLeftForWorkParts = room.energyAvailable - movePartsCost;
        let workCount = energyLeftForWorkParts / BODYPART_COST[WORK];
        let goodHarvesterWorkCount = data.goodHarvesterWorkCount(room);
        if (workCount >= goodHarvesterWorkCount) {
            let bodyParts = this.getBodyPartsFromCounts(goodHarvesterWorkCount, 0, moveCount);
            this.spawnCreepImpl(bodyParts, roles.RoleHarvester, spawn);
        }
    },
    spawnBestHarvesterPossible: function(room, spawn) {
        if (data.log) console.log('spawnBestHarvesterPossible called');
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
        if (data.log) console.log('workCount: ' + workCount);
        let bodyParts = this.getBodyPartsFromCounts(workCount, 0, moveCount);
        this.spawnCreepImpl(bodyParts, roles.RoleHarvester, spawn);
    },
    getHarvesterMoveCount: room => data.harvesterMoveCount(room),
    spawnBestWorkerPossible: function(room, spawn, role) {
        let half = room.energyAvailable / 2;
        let workCount = half / BODYPART_COST[WORK];
        if (BODYPART_COST[MOVE] != BODYPART_COST[CARRY]) {
            console.log('MOVE and CARRY no longer the same cost, update creepSpawn.js');
        }
        if (workCount == 0) return;

        let carryAndMoveCount = (half / BODYPART_COST[MOVE]) / 2;
        workCount = role != roles.RoleHauler ? workCount : 0;
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
    spawnCreepImpl: function(bodyParts, role, spawn, roomToClaim) {
        let memoryObj = { memory: { role: role } };
        if (roomToClaim != undefined) {
            memoryObj.memory.roomToClaim = roomToClaim;
        }
        let ret = spawn.spawnCreep(bodyParts, role + Game.time, memoryObj);
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
    spawnedClaimer: function(room, spawn) {
        // todo add logic so that only the closest room
        // next to the room to claim will spawn the claimer
        const claimCost = 600;
        if (util.getRoomNames().length < Game.gcl.level) {
            if (BODYPART_COST[CLAIM] != claimCost) {
                console.log('Claim bodypart no longer costs 600 energy, update creepSpawn.js');
            }
            let bodyParts = [CLAIM];
            let movePartCount = ((room.energyAvailable - claimCost) / BODYPART_COST[MOVE]) - 1;
            if (movePartCount == 0) {
                if (data.log) console.log('Not enough energy to spawn claimer');
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
};
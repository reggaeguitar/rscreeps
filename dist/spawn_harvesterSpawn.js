const logger = require('./logger');
const data = require('./data');
const spawnUtil = require('./spawn_spawnUtil');

module.exports = {
    spawnHarvester: function(room, spawn, creepCountsByRole) {
        const canWaitToSpawnGoodHarvester = 
            creepCountsByRole.hasOwnProperty(roles.RoleHauler) &&
            creepCountsByRole.hasOwnProperty(roles.RoleHarvester);
        logger.log('in spawnHarvester', { canWaitToSpawnGoodHarvester });
        if (canWaitToSpawnGoodHarvester) {
            this.trySpawnGoodHarvester(room, spawn);
        } else {
            this.spawnBestHarvesterPossible(room, spawn);
        }
    },
    trySpawnGoodHarvester: function(room, spawn) {
        const moveCount = data.harvesterMoveCount(room);
        const movePartsCost = BODYPART_COST[MOVE] * moveCount;
        const energyLeftForWorkParts = room.energyAvailable - movePartsCost;
        const workCount = energyLeftForWorkParts / BODYPART_COST[WORK];
        const goodHarvesterWorkCount = data.goodHarvesterWorkCount(room);
        const logObject = { moveCount, movePartsCost, energyLeftForWorkParts, workCount, goodHarvesterWorkCount };
        logger.log('in trySpawnGoodHarvester ' + JSON.stringify(logObject));
        // {"moveCount":1,"movePartsCost":50,"energyLeftForWorkParts":250,"workCount":2.5,"goodHarvesterWorkCount":3}
        if (workCount >= goodHarvesterWorkCount) {
            const bodyParts = spawnUtil.getBodyPartsFromCounts(goodHarvesterWorkCount, 0, moveCount);
            spawnUtil.spawnCreepImpl(bodyParts, roles.RoleHarvester, spawn);
        }
    },
    spawnBestHarvesterPossible: function(room, spawn) {
        logger.log('spawnBestHarvesterPossible called');
        let moveCount = data.harvesterMoveCount(room);
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
        const bodyParts = spawnUtil.getBodyPartsFromCounts(workCount, 0, moveCount);
        spawnUtil.spawnCreepImpl(bodyParts, roles.RoleHarvester, spawn);
    },
}
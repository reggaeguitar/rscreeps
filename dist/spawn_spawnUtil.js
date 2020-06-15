const logger = require('./logger');

module.exports = {
    getBodyPartsFromCounts: function(workCount, carryCount, moveCount) {
        let ret = [];
        iterate(ret, workCount, WORK);
        iterate(ret, carryCount, CARRY);
        iterate(ret, moveCount, MOVE);       
        function iterate(arr, count, type) {
            for (let i = 0; i < Math.floor(count); i++) {
                arr.push(type);
            }   
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
}
const logger = require('logger');

module.exports = {
    run: function(creep) {
        const route = Game.map.findRoute(creep.room, creep.memory.roomToClaim);
        if (route.length > 0) {
            logger.log('Scout now heading to room '+route[0].room);
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit);
        }
    },
}
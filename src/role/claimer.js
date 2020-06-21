const logger = require('./logger');

module.exports = {
    run: function(creep) {
        const room = Game.rooms[creep.memory.roomToClaim];
        logger.log('in claimer.run', { room, roomToClaim: creep.memory.roomToClaim });
        // todo handle attacking a controller if another player has a downgrade timer on it
        if (creep.claimController(room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(room.controller);
        }        
    }
}
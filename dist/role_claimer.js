
module.exports = {
    claimRoom: function(creep) {
        var room = creep.memory.roomToClaim;
        if (creep.claimController(room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(room.controller);
        }        
    }
}
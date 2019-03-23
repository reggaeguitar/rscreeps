
module.exports = {
    claimRoom: function(creep) {
        let room = creep.memory.roomToClaim;
        if (creep.claimController(room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(room.controller);
        }        
    }
}
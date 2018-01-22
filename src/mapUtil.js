
module.exports = {
    getSources: function(creep) {
        return creep.room.find(FIND_SOURCES);
    },
}
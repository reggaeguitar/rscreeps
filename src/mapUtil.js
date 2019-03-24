
module.exports = {
    getSourcesInRoom: function(room) {
        return room.find(FIND_SOURCES);
    },
}
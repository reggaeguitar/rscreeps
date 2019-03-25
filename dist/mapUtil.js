
module.exports = {
    directions: [
        { TOP: 1, mutatorFunc: (pos) => { return new RoomPosition(pos.x, pos.y - 1, pos.roomName); } },
        { TOP_RIGHT: 2, mutatorFunc: (pos) => { return new RoomPosition(pos.x + 1, pos.y - 1, pos.roomName); } },
        { RIGHT: 3, mutatorFunc: (pos) => { return new RoomPosition(pos.x + 1, pos.y, pos.roomName); } },
        { BOTTOM_RIGHT: 4, mutatorFunc: (pos) => { return new RoomPosition(pos.x + 1, pos.y + 1, pos.roomName); } },
        { BOTTOM: 5, mutatorFunc: (pos) => { return new RoomPosition(pos.x, pos.y + 1, pos.roomName); } },
        { BOTTOM_LEFT: 6, mutatorFunc: (pos) => { return new RoomPosition(pos.x - 1, pos.y + 1, pos.roomName); } },
        { LEFT: 7, mutatorFunc: (pos) => { return new RoomPosition(pos.x - 1, pos.y, pos.roomName); } },
        { TOP_LEFT: 8, mutatorFunc: (pos) => { return new RoomPosition(pos.x - 1, pos.y - 1, pos.roomName); } },
    ],
    getSourcesInRoom: function(room) {
        return room.find(FIND_SOURCES);
    },
}
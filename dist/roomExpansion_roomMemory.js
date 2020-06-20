module.exports = {
    ownedRooms: () => Memory.ownedRooms,
    setOwnedRooms: rooms => Memory.ownedRooms = rooms,

    roomsToScout: () => Memory.roomsToScout,
    setRoomsToScout: rooms => Memory.roomsToScout = rooms,

    roomToClaim: () => Memory.roomToClaim,
    setRoomToClaim: roomName => Memory.roomToClaim = roomName,
    
    scoutedRooms: () => Memory.scoutedRooms,
    setScoutedRooms: rooms => Memory.scoutedRooms = rooms,
}
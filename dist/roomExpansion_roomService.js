const roomMemory = require('./roomExpansion_roomMemory');
const _ = require('lodash');
const logger = require('./logger');
const data = require('./data');

module.exports = {
    run: function() {
        // loop through Game.rooms and all rooms adjacent to each owned room
        // Game.rooms returs a hash containing all the rooms available to you with room names as hash keys. 
        // A room is visible if you have a creep or an owned structure in it.
        const rooms = Game.rooms;
        const adjacentRooms = {};
        const ownedRooms = {};
        const placeHolder = 'foo';
        for (const roomName in rooms) {
            const room = Game.rooms[roomName];
            if (room && room.controller && room.controller.my) {
                ownedRooms[roomName] = placeHolder;
                const exits = Game.map.describeExits(roomName);
                logger.log('in roomService.run 1', { roomName });
                logger.log('in roomService.run 1b', { exits, adjacentRooms });
                // describe exits return example
                // {
                //     "1": "W8N4",    // TOP
                //     "3": "W7N3",    // RIGHT
                //     "5": "W8N2",    // BOTTOM
                //     "7": "W9N3"     // LEFT
                // }
                for (const key in exits) {
                    adjacentRooms[exits[key]] = placeHolder;
                }
            }
        }
        logger.log('in roomService.run 2', { adjacentRooms });
        // divide rooms into those that we own (have a controller we own) and those we don't
        // if we can claim a room then try to claim
            // have all rooms that we don't own been scouted
            // if not add the ones that haven't to a toScout list
            // if they've all been scouted then put in Memory the name of the best one toClaim
        const scoutedRooms = roomMemory.scoutedRooms() || {};
        const roomsToScout = roomMemory.roomsToScout() || {};
        for (const roomName in adjacentRooms) {
            const scoutedKeys = Object.keys(scoutedRooms);
            const haveScoutedRooms = scoutedKeys.length > 0;
            const hasAlreadyBeenScouted = haveScoutedRooms && scoutedKeys.includes(roomName);
            logger.log('in roomService.run 3', { roomName, scoutedRooms, scoutedKeys, haveScoutedRooms, hasAlreadyBeenScouted })
            if (hasAlreadyBeenScouted) continue;
            const haveAccess = Object.keys(rooms).includes(roomName);
            if (!haveAccess) {
                // don't have a creep or structure in the room, need to scout it
                roomsToScout[roomName] = placeHolder;
            } else {
                // have a creep or structure in the room for the first time, score it and save
                const score = this.evaluate(rooms[roomName]);
                scoutedRooms[roomName] = score;
                // remove from roomsToScout
                delete roomsToScout[roomName];
            }
        }
        roomMemory.setOwnedRooms(ownedRooms);
        roomMemory.setScoutedRooms(scoutedRooms);
        roomMemory.setRoomsToScout(roomsToScout);
        logger.log('in roomService.run 4', { ownedRooms, scoutedRooms, roomsToScout });
        const canClaimRoom = Object.keys(ownedRooms).length < Game.gcl.level;
        const allRoomsScouted = Object.keys(roomsToScout).length == 0;
        if (allRoomsScouted && canClaimRoom) {
            const entries = Object.entries(roomMemory.scoutedRooms); 
            const scores = entries.map(x => x[1]);
            const maxScore = _.max(scores);
            const roomToClaim = entries.find(x => x[1] == maxScore)[0];
            roomMemory.setRoomToClaim(roomToClaim);
        }
    },
    evaluate: function(room) {
        const potentialController = room.controller;
        if (potentialController == undefined) return -1;
        const controllerPos = potentialController.pos;
        const sources = room.find(FIND_SOURCES);
        let totalSourcePathCost = 0;            
        // count sources and path cost from sources to controller
        sources.forEach(s => {
            totalSourcePathCost += PathFinder.search(s.pos, controllerPos).cost;
        });
        const avePathCostToSource = totalSourcePathCost / sources.length;
        const pathScore = data.pathScoreFactor / avePathCostToSource;
        const score = pathScore + (sources.length * data.sourceScore);
        return score;
    }
}
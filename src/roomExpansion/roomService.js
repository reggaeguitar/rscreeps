const roomMemory = require('./roomExpansion_roomMemory');
const _ = require('lodash');

module.exports = {
    run: function(rooms) {
        // loop through Game.rooms and all rooms adjacent to each room
        // Game.rooms returs a hash containing all the rooms available to you with room names as hash keys. 
        // A room is visible if you have a creep or an owned structure in it.
        const rooms = Game.rooms;
        const allRooms = {};
        for (const roomName in rooms) {
            allRooms[roomName] = undefined;
            const exits = Game.map.describeExits(roomName);
            // describe exits return example
            // {
            //     "1": "W8N4",    // TOP
            //     "3": "W7N3",    // RIGHT
            //     "5": "W8N2",    // BOTTOM
            //     "7": "W9N3"     // LEFT
            // }
            for (const key in exits) {
                allRooms[exits[key]] = undefined;
            }
        }
        // divide rooms into those that we own (have a controller we own) and those we don't
        // if we can claim a room then try to claim
            // have all rooms that we don't own been scouted
            // if not add the ones that haven't to a toScout list
            // if they've all been scouted then put in Memory the name of the best one toClaim
        const ownedRooms = [];
        const scoutedRooms = roomMemory.scoutedRooms();
        const roomsToScout = roomMemory.roomsToScout();
        for (const roomName in allRooms) {
            const room = Game.rooms[roomName];
            if (room && room.controller && room.controller.my) {
                ownedRooms.push(roomName);
            } else {
                const hasAlreadyBeenScouted = Object.keys(scoutedRooms).includes(roomName);
                if (hasAlreadyBeenScouted) continue;
                const haveAccess = Object.keys(rooms).includes(roomName);
                if (!haveAccess) {
                    // don't have a creep or structure in the room, need to scout it
                    roomsToScout[roomName] = undefined;
                } else {
                    // have a creep or structure in the room for the first time, score it and save
                    const score = this.evaluate(rooms[roomName]);
                    scoutedRooms[roomName] = score;
                    // remove from roomsToScout
                    delete roomsToScout[roomName];
                }
            }
        }
        roomMemory.setOwnedRooms(ownedRooms);
        roomMemory.setScoutedRooms(scoutedRooms);
        roomMemory.setRoomsToScout(roomsToScout);
        const canClaimRoom = ownedRooms.length < Game.gcl.level;
        const allRoomsScouted = Object.keys(roomsToScout).length == 0;
        if (allRoomsScouted && canClaimRoom) {
            const entries = Object.entries(roomMemory.scoutedRooms); 
            const scores = entries.map(x => x[1]);
            const maxScore = _.max(scores);
            const roomToClaim = entries.find(x => x[1] == maxScore)[0];
            roomMemory.setRoomToClaim(roomToClaim);
        }
    
        // let rooms = util.getRoomNames();

        // let bestScore = 0;
        // let bestRoom;
        // rooms.forEach(roomOwned => {
        //     let roomsAdjacentToR = Object.entries(Game.map.describeExits(roomOwned));
        //     roomsAdjacentToR.forEach(roomToEvaluate => {
        //         // todo only look at rooms whose controller doesn't have an owner
        //         const roomName = roomToEvaluate[1];
        //         let roomScore;
        //         if (!Memory.rooms) Memory.rooms = {};
        //         if (Memory.rooms[roomName] && Memory.rooms[roomName].score) {
        //             // already scouted and scored the room
        //             roomScore = Memory.rooms[roomName].score;
        //         } else {
        //             const room = Game.rooms[roomName];
        //             if (room == undefined) {
        //                 // don't have access to the room, need to send out a scout
        //                 Memory.roomToAdd = roomName;
        //                 return;
        //             }
        //             // have access to room, evaluate and clear room to scout
        //             roomScore = evaluate(roomName);
        //             Memory.rooms[roomName].score = roomScore;
        //             Memory.roomToAdd = undefined;
        //             // add to claim if have open space for another room
        //             if (util.getRoomNames().length < Game.gcl.level) {
        //             // todo finish
        //         }
        //         if (roomScore > bestScore) {
        //             bestScore = roomScore;
        //             bestRoom = roomToEvaluate;
        //         }
        //     });
        // });
        // return bestRoom;        
    },
    evaluate: function(room) {
        const potentialController = room.controller;
        if (potentialController == undefined) return -1;
        const controllerPos = potentialController.pos;
        const sources = room.find(FIND_SOURCES);
        const totalSourcePathCost = 0;            
        // count sources and path cost from sources to controller
        sources.forEach(s => {
            totalSourcePathCost += PathFinder.search(s.pos, controllerPos).cost;
        });
        const avePathCostToSource = totalSourcePathCost / sources.length;
        const pathScore = data.pathScoreFactor / avePathCostToSource;
        const score = pathScore + (source.length * data.sourceScore);
        return score;
    }
}
module.exports = {
    bestRoomNameNearExistingRooms: function(rooms) {
        let bestScore = 0;
        let bestRoom;
        rooms.forEach(roomOwned => {
            let roomsAdjacentToR = Object.entries(Game.map.describeExits(roomOwned));
            roomsAdjacentToR.forEach(roomToEvaluate => {
                let roomScore = evaluate(roomToEvaluate[1]);
                if (roomScore > bestScore) {
                    bestScore = roomScore;
                    bestRoom = roomToEvaluate;
                }
            });
        });
        return bestRoom;        

        function evaluate(roomName) {
            const room = Game.rooms[roomName];
            const potentialControllerPos = room.find(STRUCTURE_CONTROLLER);
            if (potentialControllerPos == undefined || potentialControllerPos.length == 0) return -1;
            let controllerPos = room.find(STRUCTURE_CONTROLLER)[0].pos;
            let sources = room.find(FIND_SOURCES);
            let totalSourcePathCost = 0;            
            // count sources and path cost from sources to controller
            sources.forEach(s => {
                totalSourcePathCost += PathFinder.search(s.pos, controllerPos).cost;
            });
            let avePathCostToSource = totalSourcePathCost / sources.length;
            let pathScore = data.pathScoreFactor / avePathCostToSource;
            let score = pathScore + (source.length * data.sourceScore);
            return score;
        }
    }
}
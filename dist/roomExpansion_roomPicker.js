const util = require('util');
const data = require('data');

module.export = {
    bestRoomNameNearExistingRooms: function() {
        let rooms = util.getRoomNames();
        let bestScore = 0;
        let bestRoom;
        rooms.forEach(roomOwned => {
            let roomsAdjacentToR = getRoomsAdjacent(roomOwned);
            roomsAdjacentToR.forEach(roomToEvaluate => {
                let roomScore = evaluate(roomToEvaluate);
                if (roomScore > bestScore) {
                    bestScore = roomScore;
                    bestRoom = roomToEvaluate;
                }
            });
        });
        return bestRoom;

        function getRoomsAdjacent(roomName) {
            let directions = roomName.match(/[A-Z]/g);
            let nums = roomName.match(/\d+/g);
            let up = makeRoomName(directions, +nums[0] + 1, +nums[1]);
            let down = makeRoomName(directions, +nums[0] - 1, +nums[1]);
            let left = makeRoomName(directions, +nums[0], +nums[1] - 1);
            let right = makeRoomName(directions, +nums[0], +nums[1] + 1);
            return [up, down, left, right];

            function makeRoomName(directions, num1, num2) {
                return directions[0] + num1.toString() + directions[1] + num2.toString();
            }
        }

        function evaluate(roomName) {
            let room = Game.rooms[roomName];
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
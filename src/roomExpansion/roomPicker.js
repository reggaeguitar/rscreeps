const util = require('util');

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
            let score = 0;
            
        }
    }
}
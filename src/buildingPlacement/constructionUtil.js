const data = require('data');

module.exports = {
    nextStoragePos: function(room, spawn, storagePos) {
        console.log('nextStoragePos called at time: ' + Game.time);
        const distIncrement = 2;
        const mutatorFuncs = [(pos, dist) => new RoomPosition(pos.x, pos.y + dist, room.name),
                              (pos, dist) => new RoomPosition(pos.x + dist, pos.y, room.name),
                              (pos, dist) => new RoomPosition(pos.x, pos.y - dist, room.name),
                              (pos, dist) => new RoomPosition(pos.x - dist, pos.y, room.name)];
                              
        const roomTerrain = new Room.Terrain(room.name);

        let searchedPositions = [];
        let newfoundPos;
        let maxDistFromSpawn = 0;
        while (newfoundPos == undefined) {
            maxDistFromSpawn += distIncrement;
            findNewPos(spawn.pos, 0, maxDistFromSpawn);
        }
        
        console.log('newfoundPos: ' + newfoundPos);
        let message = 'found new construction site: ' + JSON.stringify(newfoundPos);
        if (data.log) console.log(message);
        if (data.notify) Game.notify(message);
        
        function findNewPos(pos, depth, maxDistFromSpawn) {
            if (newfoundPos != undefined) return;
            searchedPositions.push(pos);
            if (pos.getRangeTo(spawn.pos) > maxDistFromSpawn) return;
            if (depth > 14) return;
            console.log('depth: ' + depth + 'pos: ' + JSON.stringify(pos));
            if (isValid(pos)) {
                newfoundPos = pos;
                console.log('found valid pos: ' + JSON.stringify(pos));
            }
            for (let func = 0; func < mutatorFuncs.length; func++) {
                let newPos = mutatorFuncs[func](pos, distIncrement);
                console.log('newPos: ' + newPos);
                console.log('searchedPositions: ' + searchedPositions);
                let alreadyCheckedPos = searchedPositions.find(posAlreadySearched => 
                    posAlreadySearched.x == newPos.x && 
                    posAlreadySearched.y == newPos.y &&
                    posAlreadySearched.roomName == newPos.roomName) == undefined;
                console.log(alreadyCheckedPos);
                if (alreadyCheckedPos) {
                    console.log('wam');
                    //searchedPositions.push(newPos);
                    findNewPos(newPos, depth + 1, maxDistFromSpawn);
                }
            }

            // is valid
            function isValid(pos) {
                // avoid squares where harvesters harvest (right next to a source)            
                if (pos.getRangeTo(pos.findClosestByRange(FIND_SOURCES)) <= 1) return false;
                if (storagePos != undefined && pos.x == storagePos.x && pos.y == storagePos.y) return false;
                if (roomTerrain.get(pos.x, pos.y) == TERRAIN_MASK_WALL) return false;
                let ret = true;
                // look returns an object for each thing on the position
                pos.look().forEach(x => {
                    if (x.type == 'structure' || x.type == 'constructionSite') ret = false;                
                });
                return ret;
            }
        }
    }
}
module.exports = {
    nextStoragePos: function(room, spawn, storagePos) {
        const maxDistUnits = 6;
        const distIncrement = 2;
        let dist = 2;
        // todo dry these out with mutator funcs for creeps
        // up, up right, right, down right, down, down left, left, up left
        const mutatorFuncs = [(pos, dist) => new RoomPosition(pos.x, pos.y + dist, room.name),
                              (pos, dist) => new RoomPosition(pos.x + dist, pos.y + dist, room.name),
                              (pos, dist) => new RoomPosition(pos.x + dist, pos.y, room.name),
                              (pos, dist) => new RoomPosition(pos.x + dist, pos.y - dist, room.name),
                              (pos, dist) => new RoomPosition(pos.x, pos.y - dist, room.name),
                              (pos, dist) => new RoomPosition(pos.x - dist, pos.y - dist, room.name),
                              (pos, dist) => new RoomPosition(pos.x - dist, pos.y, room.name),
                              (pos, dist) => new RoomPosition(pos.x - dist, pos.y + dist, room.name)];
                              
        const roomTerrain = new Room.Terrain(room.name);

        for (let distUnit = 0; distUnit < maxDistUnits; distUnit++) {
            for (let func = 0; func < mutatorFuncs.length; func++) {
                let newPos = mutatorFuncs[func](spawn.pos, dist);
                if (isValid(newPos, roomTerrain)) return newPos;
            }
            dist += distIncrement;
        }

        function isValid(pos, roomTerrain) {
            // avoid squares where harvesters harvest (right next to a source)            
            if (pos.getRangeTo(pos.findClosestByRange(FIND_SOURCES)) <= 1) return false;
            if (storagePos != undefined && pos.x == storagePos.x && pos.y == storagePos.y) return false;
            if (roomTerrain.get(pos.x, pos.y) == TERRAIN_MASK_WALL) return false;
            // can't build on the edge of the map
            if (pos.x == 0 || pos.y == 0 || pos.x == 50 || pos.y == 50) return false;
            let ret = true;
            // look returns an object for each thing on the position
            pos.look().forEach(x => {
                if (x.type == 'structure' || x.type == 'constructionSite') ret = false;                
            });
            return ret;
        }
    }
}
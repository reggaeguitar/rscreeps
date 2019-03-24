module.exports = {
    nextStoragePos: function(room, spawn, storagePos) {
        const maxDistUnits = 6;
        const distIncrement = 2;
        let dist = 2;
        const mutatorFuncs = [pos => new RoomPosition(pos.x, pos.y + dist, room.name),
                              pos => new RoomPosition(pos.x, pos.y - dist, room.name),
                              pos => new RoomPosition(pos.x + dist, pos.y, room.name),
                              pos => new RoomPosition(pos.x - dist, pos.y, room.name)];

        for (let distUnit = 0; distUnit < maxDistUnits; distUnit++) {
            for (let func = 0; func < mutatorFuncs.length; func++) {
                let newPos = mutatorFuncs[func](spawn.pos);
                if (isValid(newPos)) return newPos;
            }
            dist += distIncrement;
        }

        const roomTerrain = new Room.Terrain(room.name);

        function isValid(pos) {
            // todo add logic to avoid squares where harvesters harvest (right next to a source)
            if (storagePos != undefined &&
                pos.x == storagePos.x && pos.y == storagePos.y) return false;
            if (roomTerrain.get(pos.x, pos.y) == TERRAIN_MASK_WALL) return false;
            let ret = true;
            // look returns an object for each thing on the position
            pos.look().forEach(x => {
                if (x.type == 'structure') ret = false;                
            });
            return ret;
        }
    }
}
module.exports = {
    nextStoragePos: function(room, spawn, storagePos) {
        const maxDistUnits = 6;
        const distIncrement = 2;
        let dist = 2;
        const roomTerrain = new Room.Terrain(room.name);
        
        function isValid(pos) {
            // avoid squares where harvesters harvest (right next to a source)            
            if (pos.getRangeTo(pos.findClosestByRange(FIND_SOURCES)) <= 1) return false;
            if (storagePos != undefined && pos.x == storagePos.x && pos.y == storagePos.y) return false;
            if (roomTerrain.get(pos.x, pos.y) == TERRAIN_MASK_WALL) return false;
            // can't build on the edge of the map
            let ret = true;
            // look returns an object for each thing on the position
            pos.look().forEach(x => {
                if (x.type == 'structure' || x.type == 'constructionSite') ret = false;                
            });
            return ret;
        }

        const potentialSite = (pos, dist, funcIndex) => {
            const newPos = mutatorFuncs[funcIndex](pos, dist);
            if (x <= 0 || y <= 0 || x >= 49 || y >= 49) return undefined;
            if (!isValid(newPos))
            return new RoomPosition(newPos.x, Pos.y);
        }
        // todo dry these out with mutator funcs for creeps
        // up, up right, right, down right, down, down left, left, up left
        const mutatorFuncs = [(pos, dist) => ({ x: pos.x, y: pos.y + dist }),
                              (pos, dist) => ({ x: pos.x + dist, y: pos.y + dist }),
                              (pos, dist) => ({ x: pos.x + dist, y: pos.y }),
                              (pos, dist) => ({ x: pos.x + dist, y: pos.y - dist }),
                              (pos, dist) => ({ x: pos.x, y: pos.y - dist }),
                              (pos, dist) => ({ x: pos.x - dist, y: pos.y - dist }),
                              (pos, dist) => ({ x: pos.x - dist, y: pos.y }),
                              (pos, dist) => ({ x: pos.x - dist, y: pos.y + dist })];
                              

        for (const distUnit = 0; distUnit < maxDistUnits; distUnit++) {
            for (const funcIndex = 0; funcIndex < mutatorFuncs.length; funcIndex++) {
                const newPos = potentialSite(spawn.pos, dist, funcIndex);
                if (newPos) return newPos;
            }
            dist += distIncrement;
        }
    }
}
const logger = require('./logger');

module.exports = {
    nextStoragePos: function(room, spawn, storagePos) {
        const maxDistUnits = 6;
        const distIncrement = 2;
        const roomTerrain = new Room.Terrain(room.name);
        
        function isValid(pos) {
            // perf return as soon as false encountered
            // avoid squares where harvesters harvest (right next to a source)            
            const closeToSource = (pos.getRangeTo(pos.findClosestByRange(FIND_SOURCES)) <= 1);
            const isStoragePos = (storagePos != undefined && pos.x == storagePos.x && pos.y == storagePos.y);
            const isTerrainMaskWall = (roomTerrain.get(pos.x, pos.y) == TERRAIN_MASK_WALL);
            // look returns an object for each thing on the position
            let ret = !(closeToSource || isStoragePos || isTerrainMaskWall);
            pos.look().forEach(x => {
                if (x.type == 'structure' || x.type == 'constructionSite') ret = false;                
            });
            logger.log('in isValid', {ret, closeToSource, isStoragePos, isTerrainMaskWall });            
            return ret;
        }
        
        const potentialSite = (pos, dist, funcIndex) => {
            const newPos = mutatorFuncs[funcIndex](pos, dist);
            console.log('a' + JSON.stringify(newPos));
            if (newPos.x <= 0 || newPos.y <= 0 || newPos.x >= 49 || newPos.y >= 49) return undefined;
            const newRoomPos = new RoomPosition(newPos.x, newPos.y, room.name);
            console.log('b' + JSON.stringify(newRoomPos));
            if (!isValid(newRoomPos)) return undefined;
            return newRoomPos;
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
            
            let dist = 2;
            for (let distUnit = 0; distUnit < maxDistUnits; distUnit++) {
                for (let funcIndex = 0; funcIndex < mutatorFuncs.length; funcIndex++) {
                    const newPos = potentialSite(spawn.pos, dist, funcIndex);
                    console.log('newPos: ' + JSON.stringify(newPos));
                    if (newPos) return newPos;
            }
            dist += distIncrement;
        }
    }
}
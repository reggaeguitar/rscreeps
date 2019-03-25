const constructionUtil = require('buildingPlacement_constructionUtil');
const mapUtil = require('mapUtil');
          
module.exports = {
    run: function(room, spawn) {
        const storagePosStr = 'storagePos';
        if (Memory[room.name + storagePosStr] == undefined) {
            Memory[room.name + storagePosStr] = constructionUtil.nextStoragePos(room, spawn);
        }
        let storagePos = Memory[room.name + storagePosStr];
        this.buildRoads(room, spawn);
    
        const nonRoads = [[STRUCTURE_EXTENSION, 'extension'], 
                          [STRUCTURE_CONTAINER, 'container'],
                          [STRUCTURE_TOWER, 'tower'],
                          [STRUCTURE_STORAGE, 'storage']];
        nonRoads.forEach(structureTypeAndPropName => {
            let structureType = structureTypeAndPropName[0];
            let propName = structureTypeAndPropName[1];
            let structureCount = room.find(structureType).length;
            let amountCanBuild = CONTROLLER_STRUCTURES[propName][room.controller.level];
            let canBuild = structureCount < amountCanBuild;
            if (canBuild) {
                if (structureType == STRUCTURE_STORAGE) {
                    room.createConstructionSite(storagePos, structureType)
                } else {
                    let pos = constructionUtil.nextStoragePos(room, spawn, storagePos);
                    room.createConstructionSite(pos, structureType);
                }
            }
        });
    },
    buildRoads: function(room, spawn) {
        // spawn to controller
        buildRoadImpl(spawn.pos, room.controller.pos);
        // spawn and controller to sources
        mapUtil.getSourcesInRoom(room).forEach(source => {
            buildRoadImpl(spawn.pos, source.pos);
            buildRoadImpl(room.controller.pos, source.pos);
        });

        function buildRoadImpl(orig, dest) {
            PathFinder.search(orig, 
                { pos: dest, range: 0 }).path
                .map(pos => room.createConstructionSite(pos, STRUCTURE_ROAD));
        }
    },    
}
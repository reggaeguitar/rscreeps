const constructionUtil = require('buildingPlacement_constructionUtil');
const mapUtil = require('mapUtil');

        // // ctrl level 2+ build extensions and containers
        // if (room.controller.level >= 2) {            
        //     this.buildExtensions(room, spawn, storagePos);
        //     this.buildContainers(room, spawn, storagePos);
        // }
    
        // // ctrl level 3 build a tower
        // if (room.controller.level >= 3) {
        //     this.buildTowers(room, spawn, storagePos)
        // }
    
        // // ctrl level 4 build storage    
module.exports = {
    run: function(room, spawn) {
        // todo make sure to not build on 
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
                let pos = constructionUtil.nextStoragePos(room, spawn, storagePos);
                room.createConstructionSite(pos, structureType);
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
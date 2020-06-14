const constructionUtil = require('./buildingPlacement_constructionUtil');
const wallDecider = require('./buildingPlacement_wallDecider');

module.exports = {
    run: function(room, spawn) {
        const ctrlLevelForStorage = 4;
        const storagePosStr = 'storagePos';
        // todo clear memory for old rooms after respawning
        if (Memory[room.name + storagePosStr] == undefined) {
            Memory[room.name + storagePosStr] = constructionUtil.nextStoragePos(room, spawn);
        }
        const storagePos = Memory[room.name + storagePosStr];
        if (room.controller.level >= ctrlLevelForStorage &&
            room.find(STRUCTURE_STORAGE).length == 0) {
        }
        this.buildRoads(room, spawn);
        // todo add spawn building logic in
        const nonRoads = [[STRUCTURE_EXTENSION, 'extension'], 
                          // containers aren't even worth building really
                          //[STRUCTURE_CONTAINER, 'container'],
                          [STRUCTURE_TOWER, 'tower']];
        nonRoads.forEach(structureTypeAndPropName => {
            const structureType = structureTypeAndPropName[0];
            const propName = structureTypeAndPropName[1];
            const structureCount = room.find(structureType).length;
            const amountCanBuild = CONTROLLER_STRUCTURES[propName][room.controller.level];
            const canBuild = structureCount < amountCanBuild;
            if (canBuild) {
                const pos = constructionUtil.nextStoragePos(room, spawn, storagePos);
                room.createConstructionSite(pos, structureType);
            }
        });
    },
    buildRoads: function(room, spawn) {
        // spawn to controller
        buildRoadImpl(spawn.pos, room.controller.pos);
        // spawn and controller to sources
        room.find(FIND_SOURCES).forEach(source => {
            buildRoadImpl(spawn.pos, source.pos);
            buildRoadImpl(room.controller.pos, source.pos);
        });

        function buildRoadImpl(orig, dest) {
            // build one way then the reverse
            PathFinder.search(orig, 
                { pos: dest, range: 0 }).path
                .map(pos => room.createConstructionSite(pos, STRUCTURE_ROAD));
            PathFinder.search(dest, 
              { pos: orig, range: 0 }).path
              .map(pos => room.createConstructionSite(pos, STRUCTURE_ROAD));
        }
    },
    buildWallsAndRamparts: function(room) {
        const locations = wallDecider.getWallAndRampartLocations(room);
        locations.map(x => room.createConstructionSite(x.pos, x.type));
    },    
}
const constructionUtil = require('buildingPlacement_constructionUtil');
const mapUtil = require('mapUtil');

module.exports = {
    run: function(room, spawn) {
        // todo make sure to not build on 
        const storagePosStr = 'storagePos';
        if (Memory[room.name + storagePosStr] == undefined) {
            Memory[room.name + storagePosStr] = constructionUtil.nextStoragePos(room, spawn);
        }
        let storagePos = Memory[room.name + storagePosStr];
        this.buildRoads(room, spawn);
    
        // ctrl level 2+ build extensions and containers
        if (room.controller.level >= 2) {            
            this.buildExtensions(room, spawn);            
        }
    
        // ctrl level 3 build a tower
    
        // ctrl level 4 build storage    
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
    buildExtensions: function(room, spawn, storagePos) {
        if (!canBuildExtension(room)) return;
        let pos = constructionUtil.nextStoragePos(room, spawn, storagePos);
        room.createConstructionSite(pos, STRUCTURE_EXTENSION);

        function canBuildExtension(room) {
            // 2 	5 extensions  (50 capacity)
            // 3 	10 extensions (50 capacity)
            // 4 	20 extensions (50 capacity)
            // 5 	30 extensions (50 capacity)
            // 6 	40 extensions (50 capacity)
            // 7 	50 extensions (100 capacity)
            // 8 	60 extensions (200 capacity)
            const extCount = room.find(STRUCTURE_EXTENSION).length;
            if (room.level < 3) {
                return extCount < 5;
            } else {
                let extCountForLevel = (room.controller.level - 2) * 10;
                return extCount < extCountForLevel;
            }
        }
    },
}
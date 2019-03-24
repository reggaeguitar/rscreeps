const constructionUtil = require('buildingPlacement_constructionUtil');
const mapUtil = require('mapUtil');

module.exports = {
    run: function(room, spawn) {
        // todo make sure to save room for storage
        const storagePosStr = 'storagePos';
        if (Memory[room.name + storagePosStr] == undefined) {
            Memory[room.name + storagePosStr] = constructionUtil.nextStoragePos(room, spawn);
        }
        //switch         
        this.buildRoads(room, spawn);
    
        // ctrl level 2+ build extensions
    
        // ctrl level 3 build a tower
    
        // ctrl level 4 build storage    
    },
    buildRoads: function(room, spawn) {
        // spawn to controller
        buildRoadImpl(spawn.pos, room.controller.pos);
        // spawn and controller to sources
        let sources = mapUtil.getSourcesInRoom(room);
        for (let source in sources) {
            buildRoadImpl(spawn.pos, source.pos);
            buildRoadImpl(room.controller.pos, source.pos);
        }

        function buildRoadImpl(orig, dest) {
            PathFinder.search(orig, 
                { pos: dest, range: 0 }).path
                .map(pos => room.createConstructionSite(pos, STRUCTURE_ROAD));
        }
    }
}
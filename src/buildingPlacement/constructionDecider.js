const constructionUtil = require('buildingPlacement_constructionUtil');

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
        // ctrl level 1 build roads between spawn,
        // sources and room controller
        let roadPositions = PathFinder.search(spawn.pos, 
            { pos: room.controller.pos, range: 0 }).path;
        roadPositions.map(pos => room.createConstructionSite(pos, STRUCTURE_ROAD));
    }
}
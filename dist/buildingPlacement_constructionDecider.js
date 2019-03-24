const constructionUtil = require('buildingPlacement_constructionUtil');

module.exports = {
    run: function(room, spawn) {
        // todo make sure to save room for storage
        const storagePosStr = 'storagePos';
        if (Memory[room.name + storagePosStr] == undefined) {
            Memory[room.name + storagePosStr] = constructionUtil.nextStoragePos(room, spawn);
        }
        //switch 
        // ctrl level 1 build roads between spawn
        this.buildRoads();
        // sources and room controller
    
        // ctrl level 2+ build extensions
    
        // ctrl level 3 build a tower
    
        // ctrl level 4 build storage    
    },
    buildRoads: function(room, spawn) {

    }
}
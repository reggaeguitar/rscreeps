const constants = require('constants');

module.exports = {
    run: function(creep) {
        let sources = creep.room.find(FIND_SOURCES)
        if (creep.memory.sourceToHarvest == undefined) {
            this.startHarvest(creep, sources);
        }        
        this.mineSources(creep, sources);
    },
    mineSources: function(creep, sources) {
        if (creep.harvest(sources[creep.memory.sourceToHarvest]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.sourceToHarvest], 
                { visualizePathStyle: {stroke: '#ffaa00' } });
        }
    },    
    startHarvest: function(creep, sources) {
        if (sources.length == 1) return 0;
        let creepsInSameRoom = _filter(Game.creeps, c => c.room.name == creep.room.name);
        let creepRoleCounts = _.countBy(creepsInSameRoom, c => c.memory.role == constants.RoleHarvester);
        let sourceToHarvest = 0;
        if (creepRoleCounts.hasOwnProperty(constants.RoleHarvester)) {
            let harvesters = _.filter(creepsInSameRoom, c => c.memory.role == constants.RoleHarvester);
            let harvestersSources = harvesters.map(h => h.memory.sourceToHarvest);
            let sourceCounts = _.countBy(harvestersSources, x => x);
            // assign the harvester to the source with the least amount of harvesters
            // (a, b) => a - b makes the sort ascending
            let sortedCounts = Object.keys(sourceCounts).sort((a, b) => a - b);            
            sourceToHarvest = sortedCounts[0];
        } else {
            // todo try changin to closest source instead of random
            sourceToHarvest = _.random(0, sources.length - 1);
        }        
        creep.memory.sourceToHarvest = sourceToHarvest;
    }
};

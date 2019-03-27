module.exports = {
    run: function(creep) {
        let sources = room.find(FIND_SOURCES)
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
        // todo it seems like this method is hardcoded to having two sources 
        // and two harvesters in the room
        let creepRoleCounts = _.countBy(Game.creeps, c => c.memory.role);
        let sourceToHarvest = 0;
        if (creepRoleCounts.hasOwnProperty('harvester')) {
            let harvesters = _.filter(Game.creeps, c => c.memory.role == 'harvester');
            let otherHarvesterSource = _.sortBy(harvesters, h => h.ticksToLive)[0]
                    .memory.sourceToHarvest;
            sourceToHarvest = otherHarvesterSource == 0 ? 1 : 0;
        } else {
            // todo try changin to closest source instead of random
            sourceToHarvest = _.random(0, sources.length - 1);
        }        
        creep.memory.sourceToHarvest = sourceToHarvest;
    }
};


module.exports = {
    mineSources: function(creep) {
        var sources = mapUtil.getSources(creep);
        if (creep.harvest(sources[creep.memory.sourceToHarvest]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.sourceToHarvest], 
                { visualizePathStyle: {stroke: '#ffaa00' } });
        }
    },
}
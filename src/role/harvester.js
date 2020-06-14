const roles = require('./role_roles');
const logger = require('./logger');
const _ = require('lodash');

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
                { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    },
    decideWhichSourceToHarvest: function(harvesters, sourceCount) {
        // find source with least count of harvesters assigned
        const harvestersSources = harvesters.map(h => h.memory.sourceToHarvest);
        const sourceCounts = _.countBy(harvestersSources, x => x);           
        // assign the harvester to the source with no harvesters
        const min = _.min(sourceCounts, x => x);
        const entries = Object.entries(sourceCounts);
        if (entries.length != sourceCount) {
            // there is a source with no harvester assigned
            // const allSources = 
            function* generator() {
                let index = sourceCount;
                while (index > 0) {
                    index = index - 1;
                    yield index;
                }
              }
            const allSources = Array.from(generator());
            const keysAsInts = Object.keys(entries).map(x => +x);
            const sourcesWithNoHarvestersAssigned = _.pull(allSources, ...keysAsInts);
            return sourcesWithNoHarvestersAssigned[0];
        }
        const sourcesWithMinHarvestersAssigned = entries.filter(x => x[1] == min).map(x => +x[0]);
        if (sourcesWithMinHarvestersAssigned.length == 1) return sourcesWithMinHarvestersAssigned[0];
        // if there is a tie return the source with the oldest harvester assigned, aka soonest to die
        const harvestersAtMinSources = harvesters.filter(x => 
            sourcesWithMinHarvestersAssigned.includes(x.memory.sourceToHarvest));
        const oldestAge = _.min(harvestersAtMinSources.map(x => x.ticksToLive));
        const ret = harvestersAtMinSources.find(x => x.ticksToLive == oldestAge).memory.sourceToHarvest;
        return ret;
    },
    startHarvest: function(creep, sources) {
        if (sources.length == 1) return 0;
        const creepsInSameRoom = _.filter(Game.creeps, c => c.room.name == creep.room.name);
        const creepRoleCounts = _.countBy(creepsInSameRoom, c => c.memory.role == roles.RoleHarvester);
        let sourceToHarvest = 0;
        if (!creepRoleCounts.hasOwnProperty('./true')) {
            sourceToHarvest = _.random(0, sources.length - 1);
        } else {
            const harvesters = _.filter(creepsInSameRoom, c => c.memory.role == roles.RoleHarvester
                && c.memory.sourceToHarvest != undefined);
            sourceToHarvest = this.decideWhichSourceToHarvest(harvesters, source.length);
        }
        creep.memory.sourceToHarvest = sourceToHarvest;
    }
};

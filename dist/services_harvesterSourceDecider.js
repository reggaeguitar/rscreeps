const _ = require('lodash');

module.exports = {
    decideWhichSourceToHarvest: function(harvesters, sourceCount) {
        // find source with least count of harvesters assigned
        const harvestersSources = harvesters
            .map(h => h.memory.sourceToHarvest).filter(x => x);
        const sourceCounts = _.countBy(harvestersSources, x => x);           
        // assign the harvester to the source with no harvesters
        const min = _.min(sourceCounts, x => x);
        const entries = Object.entries(sourceCounts);
        if (entries.length != sourceCount) {
            // there is a source with no harvester assigned
            function* allSourcesGenerator() {
                let index = sourceCount;
                while (index > 0) {
                    index = index - 1;
                    yield index;
                }
              }
            const allSources = Array.from(allSourcesGenerator());
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
}
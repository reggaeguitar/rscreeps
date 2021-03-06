const _ = require('lodash');
const logger = require('./logger');

module.exports = {
    decideWhichSourceToHarvest: function(harvesters, sourceCount) {
        // find source with least count of harvesters assigned
        const harvestersSources = harvesters
            .map(h => h.memory.sourceToHarvest).filter(x => x !== undefined);
        const sourceCounts = _.countBy(harvestersSources, x => x);           
        // assign the harvester to the source with no harvesters
        const min = _.min(sourceCounts, x => x);
        const entries = Object.entries(sourceCounts);
        // in decideWhichSourceToHarvest 0:  {"sourceCount":2,"harvestersSources":[1],"sourceCounts":{"1":1},"min":1,"entries":[["1",1]]} build.min.js:1:313830
        logger.email('in decideWhichSourceToHarvest 0: ', { sourceCount, harvestersSources, sourceCounts, min, entries });
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
            const keysAsInts = entries.map(x => +x[0]);
            logger.email('in decideWhichSourceToHarvest 1', { allSources, keysAsInts });
            _.pull(allSources, ...keysAsInts);
            const ret = allSources[0];
            logger.email('in decideWhichSourceToHarvest 2', { ret, allSources, keysAsInts });
            return ret;
        }
        const sourcesWithMinHarvestersAssigned = entries.filter(x => x[1] == min).map(x => +x[0]);
        if (sourcesWithMinHarvestersAssigned.length == 1) return sourcesWithMinHarvestersAssigned[0];
        // if there is a tie return the source with the oldest harvester assigned, aka soonest to die
        const harvestersAtMinSources = harvesters.filter(x => 
            sourcesWithMinHarvestersAssigned.includes(x.memory.sourceToHarvest));
        const oldestAge = _.min(harvestersAtMinSources.map(x => x.ticksToLive));
        const ret = harvestersAtMinSources.find(x => x.ticksToLive == oldestAge).memory.sourceToHarvest;
        logger.email('in decideWhichSourceToHarvest 3', { sourcesWithMinHarvestersAssigned,
            harvestersAtMinSources, oldestAge, ret });
        return ret;
    },
}
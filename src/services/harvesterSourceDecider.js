const _ = require('lodash');
const logger = require('./logger');

module.exports = {
    decideWhichSourceToHarvest: function(harvesters, sourceCount) {
        // find source with least count of harvesters assigned
        const harvestersSources = harvesters
            .map(h => h.memory.sourceToHarvest).filter(x => x);
        const sourceCounts = _.countBy(harvestersSources, x => x);           
        // assign the harvester to the source with no harvesters
        const min = _.min(sourceCounts, x => x);
        const entries = Object.entries(sourceCounts);
        // in decideWhichSourceToHarvest 0: {"harvestersSources":[1],"sourceCounts":{"1":1},"min":1,"entries":[["1",1]]}
        console.log('in decideWhichSourceToHarvest 0: ' + JSON.stringify({ harvestersSources, sourceCounts, min, entries }));
        logger.email('in decideWhichSourceToHarvest 0: ', { harvestersSources, sourceCounts, min, entries });
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
            logger.email('in decideWhichSourceToHarvest 1', { allSources, keysAsInts, sourcesWithNoHarvestersAssigned });
            return sourcesWithNoHarvestersAssigned[0];
        }
        const sourcesWithMinHarvestersAssigned = entries.filter(x => x[1] == min).map(x => +x[0]);
        if (sourcesWithMinHarvestersAssigned.length == 1) return sourcesWithMinHarvestersAssigned[0];
        // if there is a tie return the source with the oldest harvester assigned, aka soonest to die
        const harvestersAtMinSources = harvesters.filter(x => 
            sourcesWithMinHarvestersAssigned.includes(x.memory.sourceToHarvest));
        const oldestAge = _.min(harvestersAtMinSources.map(x => x.ticksToLive));
        const ret = harvestersAtMinSources.find(x => x.ticksToLive == oldestAge).memory.sourceToHarvest;
        logger.email('in decideWhichSourceToHarvest 2', { sourcesWithMinHarvestersAssigned,
            harvestersAtMinSources, oldestAge, ret });
        return ret;
    },
}
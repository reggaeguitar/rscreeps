const roles = require('role_roles');
const logger = require('logger');

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
    startHarvest: function(creep, sources) {
      //in startHarvestcreepRoleCounts: {"false":1,"true":2} 
      // harvestersSources: [null] sourceCounts: {"undefined":1} 
      // sortedCounts: [["undefined",1]] potentialMatch: undefined 
      // i: 0 assigned i to sourceToHarvest
        if (sources.length == 1) return 0;
        const creepsInSameRoom = _.filter(Game.creeps, c => c.room.name == creep.room.name);
        const creepRoleCounts = _.countBy(creepsInSameRoom, c => c.memory.role == roles.RoleHarvester);
        let sourceToHarvest = 0;
        let message = 'in startHarvestcreepRoleCounts: ' +  JSON.stringify(creepRoleCounts);
        if (creepRoleCounts.hasOwnProperty('true')) {
            let harvesters = _.filter(creepsInSameRoom, c => c.memory.role == roles.RoleHarvester
                && c.memory.sourceToHarvest != undefined);            
            let harvestersSources = harvesters.map(h => h.memory.sourceToHarvest);
            let sourceCounts = _.countBy(harvestersSources, x => x);           
            // todo sort by time to live also
            // assign the harvester to the source with no harvesters
            // or the least amount of harvesters
            // (a, b) => a - b makes the sort ascending
            let sortedCounts = [];
            for (let source in sourceCounts) {
                sortedCounts.push([source, sourceCounts[source]]);
            }
            sortedCounts.sort((a, b) => a[1] - b[1]);
          //   function sortF(ob1, ob2) {
          //     if (ob1.strength > ob2.strength) {
          //         return 1;
          //     } else if (ob1.strength < ob2.strength) { 
          //         return -1;
          //     }
          
          //     // Else go to the 2nd item
          //     if (ob1.name < ob2.name) { 
          //         return -1;
          //     } else if (ob1.name > ob2.name) {
          //         return 1
          //     } else { // nothing to split them
          //         return 0;
          //     }
          // }

            message += ' harvestersSources: ' + JSON.stringify(harvestersSources) +
                       ' sourceCounts: ' + JSON.stringify(sourceCounts) +
                       ' sortedCounts: ' + JSON.stringify(sortedCounts);
            let assignedSource = false;
            for (let i = 0; i < sources.length; ++i) {
                let potentialMatch = sortedCounts.find(x => x[0] == i);
                message += ' potentialMatch: ' + potentialMatch || 'was undefined';
                if (potentialMatch == undefined) {
                    message += ' i: ' + i.toString();
                    sourceToHarvest = i;
                    assignedSource = true;
                    message += ' assigned i to sourceToHarvest';
                    break;
                }
                message += '\n';
            }
            if (assignedSource == false) {
                sourceToHarvest = sortedCounts[0][0];
                message += ' assigned sortedCounts[0][0]: ' + sortedCounts[0][0].toString() + ' to sourceToHarvest';
            }
            logger.log(message);
            logger.email(message);
        } else {
            sourceToHarvest = _.random(0, sources.length - 1);
        }        
        creep.memory.sourceToHarvest = sourceToHarvest;
    }
};

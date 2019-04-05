const roles = require('role_roles');
const data = require('data');

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
        if (sources.length == 1) return 0;
        let creepsInSameRoom = _.filter(Game.creeps, c => c.room.name == creep.room.name);
        let creepRoleCounts = _.countBy(creepsInSameRoom, c => c.memory.role == roles.RoleHarvester);
        let sourceToHarvest = 0;
        let message = 'creepRoleCounts:' +  JSON.stringify(creepRoleCounts);
        if (creepRoleCounts.hasOwnProperty('true')) {
            let harvesters = _.filter(creepsInSameRoom, c => c.memory.role == roles.RoleHarvester
                && c.memory.sourceToHarvest != undefined);
            let harvestersSources = harvesters.map(h => h.memory.sourceToHarvest);
            let sourceCounts = _.countBy(harvestersSources, x => x);           
            // assign the harvester to the source with no harvesters
            // or the least amount of harvesters
            // (a, b) => a - b makes the sort ascending    
            let sortedCounts = [];
            for (let source in sourceCounts) {
                sortedCounts.push([source, sourceCounts[source]]);
            }
            sortedCounts.sort((a, b) => a[1] - b[1]);       
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
                // todo take into account age of creeps when sources have the same amount there
                sourceToHarvest = sortedCounts[0][0];
                message += ' assigned sortedCounts[0][0]: ' + sortedCounts[0][0].toString() + ' to sourceToHarvest';
            }
            if (data.log) console.log(message);
            if (data.notify) Game.notify(message);
        } else {
            sourceToHarvest = _.random(0, sources.length - 1);
        }        
        creep.memory.sourceToHarvest = sourceToHarvest;
    }
};

const roles = require('./role_roles');
const _ = require('lodash');
const harvesterSourceDecider = require('services_harvesterSourceDecider');

module.exports = {
    run: function(creep) {
        const room = Game.rooms[creep.memory.homeRoom];
        let sources = room.find(FIND_SOURCES)
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
        const creepsInSameRoom = _.filter(Game.creeps, c => c.room.name == creep.memory.homeRoom);
        const harvesterRoleCounts = _.countBy(creepsInSameRoom, c => c.memory.role == roles.RoleHarvester);
        let sourceToHarvest = 0;
        if (!harvesterRoleCounts.hasOwnProperty('true')) {
            sourceToHarvest = _.random(0, sources.length - 1);
        } else {
            const harvesters = _.filter(creepsInSameRoom, c => c.memory.role == roles.RoleHarvester
                && c.memory.sourceToHarvest != undefined);
            sourceToHarvest = harvesterSourceDecider.decideWhichSourceToHarvest(harvesters, source.length);
        }
        creep.memory.sourceToHarvest = sourceToHarvest;
    }
};

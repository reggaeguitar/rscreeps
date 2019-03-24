const _ = require('lodash');
const data = require('data');

module.exports = {
    printCreepRoleCounts: function() {
        if (data.log) console.log(JSON.stringify(this.getCreepRoleCounts()));
    },
    getCreepRoleCounts: function() {
        return _.countBy(Game.creeps, c => c.memory.role);
    },   
    clearDeadCreepsFromMemory: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];                
            }
        }
    },    
    getCreepCount: function() {
        return Object.keys(Game.creeps).length;
    },
    getRoles: function() {
        return Object.keys(data.creepData);
    },    
};
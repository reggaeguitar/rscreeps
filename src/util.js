var data = require('data');

module.exports = {
    printCreepRoleCounts: function() {
        console.log(JSON.stringify(this.getCreepRoleCounts()));
    },
    getCreepRoleCounts: function() {
        var ret = {};
        for (var role in data.creepData) {
            var count = _.filter(Game.creeps, c => c.memory.role == role).length;
            ret[role] = count;
        }
        return ret;
    },
    getCreepSourcesToMine: function() {
        var ret = {};
        for (var creep in Game.creeps) {
            var sourceToMine = creep.memory.sourceToHarvest;
            ret[sourceToMine] = ret[sourceToMine] + 1;
        }
        return ret;
    },
    clearDeadCreepsFromMemory: function() {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];                
            }
        }
    }
};
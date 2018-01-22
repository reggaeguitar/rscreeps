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
    clearDeadCreepsFromMemory: function() {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];                
            }
        }
    },
    getSources: function(creep) {
        return creep.room.find(FIND_SOURCES);
    },
    getCreepCount: function() {
        return Object.keys(Game.creeps).length;
    },
    getRoles: function() {
        return Object.keys(data.creepData);
    },
    creepIsNextToSource: function(creep) {
        var isNearSource = this.sourceCreepIsNear(creep) != -1;
        return isNearSource;
    },
    sourceCreepIsNear: function(creep) {
        var sources = this.getSources(creep);
        return _.findIndex(sources, src => src.pos.isNearTo(creep.pos));
    },
    moveAwayFromSource: function(creep) {
        var sourceCreepIsNear = this.getSources()[this.sourceCreepIsNear(creep)];
        var sourcePos = sourceCreepIsNear.pos;
        for (let i = 0; i < data.directions.length; i++) {
            const element = data.directions[i];
            var newPos = element.mutatorFunc(creep.pos);
            if (isPassable(creep.pos)) {
                creep.moveTo(pos);
            }
        }
    },
    isPassable: function(pos) {
        // returns false for swamp currently
        // is passable if not wall or occupied by a creep
        var terrain = Game.map.getTerrainAt(pos);
        var posHasCreep = pos.findClosestByRange(FIND_MY_CREEPS).pos.isEqualTo(pos);
        return terrain == 'plain' && !posHasCreep;
    },
};
var mapUtil = require('mapUtil');

module.exports = {
    creepIsNextToSource: function(creep) {
        var isNearSource = this.sourceCreepIsNear(creep) != -1;
        return isNearSource;
    },
    sourceCreepIsNear: function(creep) {
        var sources = mapUtil.getSources(creep);
        return _.findIndex(sources, src => src.pos.isNearTo(creep.pos));
    },
    moveAwayFromSource: function(creep) {
        var sourceCreepIsNear = mapUtil.getSources(creep)[this.sourceCreepIsNear(creep)];
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
}
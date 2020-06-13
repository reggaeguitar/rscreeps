const mapUtil = require('mapUtil');
const data = require('data');

module.exports = {   
    creepIsNextToSource: function(creep) {
        return this.sourceCreepIsNear(creep) != -1;
    },
    sourceCreepIsNear: function(creep) {
        let sources = creep.room.find(FIND_SOURCES)
        return _.findIndex(sources, src => src.pos.isNearTo(creep.pos));
    },
    moveAwayFromSource: function(creep) {
        if (data.log) data.logObject('in moveAwayFromSource', { creep });
        for (let i = 0; i < mapUtil.directions.length; i++) {
            const element = mapUtil.directions[i];
            let newPos = element.mutatorFunc(creep.pos);
            if (this.isPassable(creep, newPos)) {
                creep.moveTo(newPos);
            }
        }
    },
    isPassable: function(creep, newPos) {
        // is passable if plain and not occupied by a creep
        let terrain = Game.map.getRoomTerrain(creep.room.name).get(newPos.x, newPos.y);
        let creepsOnNewPos = _.filter(newPos.look(), x => x.type == 'creep');
        let posHasCreep = creepsOnNewPos != undefined && creepsOnNewPos.length;
        return terrain == 'plain' && !posHasCreep;
    },    
}
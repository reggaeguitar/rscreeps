const mapUtil = require('mapUtil');

module.exports = {   
    creepIsNextToSource: (creep) => this.sourceCreepIsNear(creep) != -1,
    sourceCreepIsNear: (creep) => {
        let sources = creep.room.find(FIND_SOURCES)
        return _.findIndex(sources, src => src.pos.isNearTo(creep.pos));
    },
    moveAwayFromSource: function(creep) {
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
        let creepsOtherThanThisOne = _.pull(Object.keys(Game.creeps), creep.name);        
        let posHasCreep = _.findIndex(creepsOtherThanThisOne,
            c => Game.creeps[c].pos.isEqualTo(newPos)) != -1;
        return terrain == 'plain' && !posHasCreep;
    },    
}
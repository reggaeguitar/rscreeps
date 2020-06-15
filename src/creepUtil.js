const mapUtil = require('./mapUtil');
const logger = require('./logger');

module.exports = {
    fooTest: () => logger.fooPropTest(),
    creepIsNextToSource: function(creep) {
        return this.sourceCreepIsNear(creep) != -1;
    },
    sourceCreepIsNear: function(creep) {
        let sources = Game.rooms[creep.memory.homeRoom].find(FIND_SOURCES)
        return _.findIndex(sources, src => src.pos.isNearTo(creep.pos));
    },
    moveAwayFromSource: function(creep) {
      let foundPassable = false;
      for (let i = 0; i < mapUtil.directions.length; i++) {
        const element = mapUtil.directions[i];
        let newPos = element.mutatorFunc(creep.pos);
        logger.log('newPos:', newPos);
        if (this.isPassable(creep, newPos)) {
          logger.log('foundPassable square to move to', { name: creep.name, newPos });
          foundPassable = true;
          creep.moveTo(newPos);
        }
      }
      logger.log('in moveAwayFromSource', { creep, foundPassable });
    },
    isPassable: function(creep, newPos) {
        // is passable if plain and not occupied by a creep
        let terrain = Game.map.getRoomTerrain(creep.memory.homeRoom).get(newPos.x, newPos.y);
        let creepsOnNewPos = _.filter(newPos.look(), x => x.type == 'creep');
        let posHasCreep = creepsOnNewPos != undefined && creepsOnNewPos.length;
        logger.log('in isPassable', { newPos, terrain, creepsOnNewPosIsDefined: creepsOnNewPos != undefined, posHasCreep });
        return terrain == 0 && !posHasCreep;
    },    
}
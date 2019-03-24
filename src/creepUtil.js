const mapUtil = require('mapUtil');

module.exports = {
    directions: [
        { TOP: 1, mutatorFunc: (pos) => { return new RoomPosition(pos.x, pos.y - 1, pos.roomName); } },
        { TOP_RIGHT: 2, mutatorFunc: (pos) => { return new RoomPosition(pos.x + 1, pos.y - 1, pos.roomName); } },
        { RIGHT: 3, mutatorFunc: (pos) => { return new RoomPosition(pos.x + 1, pos.y, pos.roomName); } },
        { BOTTOM_RIGHT: 4, mutatorFunc: (pos) => { return new RoomPosition(pos.x + 1, pos.y + 1, pos.roomName); } },
        { BOTTOM: 5, mutatorFunc: (pos) => { return new RoomPosition(pos.x, pos.y + 1, pos.roomName); } },
        { BOTTOM_LEFT: 6, mutatorFunc: (pos) => { return new RoomPosition(pos.x - 1, pos.y + 1, pos.roomName); } },
        { LEFT: 7, mutatorFunc: (pos) => { return new RoomPosition(pos.x - 1, pos.y, pos.roomName); } },
        { TOP_LEFT: 8, mutatorFunc: (pos) => { return new RoomPosition(pos.x - 1, pos.y - 1, pos.roomName); } },
    ],
    //
    creepIsNextToSource: function(creep) {
        let isNearSource = this.sourceCreepIsNear(creep) != -1;
        return isNearSource;
    },
    sourceCreepIsNear: function(creep) {
        let sources = mapUtil.getSources(creep);
        return _.findIndex(sources, src => src.pos.isNearTo(creep.pos));
    },
    moveAwayFromSource: function(creep) {
        // todo figure out what two lines below were doing and if a new implementation is needed
        // let sourceCreepIsNear = mapUtil.getSources(creep)[this.sourceCreepIsNear(creep)];
        // let sourcePos = sourceCreepIsNear.pos;
        for (let i = 0; i < this.directions.length; i++) {
            const element = this.directions[i];
            let newPos = element.mutatorFunc(creep.pos);
            if (this.isPassable(creep, newPos)) {
                creep.moveTo(newPos);
            }
        }
    },
    isPassable: function(creep, newPos) {
        // is passable if plain and not occupied by a creep
        let terrain = Game.map.getTerrainAt(newPos);
        let creepsOtherThanThisOne = _.pull(Object.keys(Game.creeps), creep.name);        
        let posHasCreep = _.findIndex(creepsOtherThanThisOne,
            c => Game.creeps[c].pos.isEqualTo(newPos)) != -1;
        return terrain == 'plain' && !posHasCreep;
    },    
}
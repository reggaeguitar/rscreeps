const _ = require('./lodash');

module.exports = {
    run: function(tower) {
        let closestHostile = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        let injuredCreeps = _.filter(Game.creeps, c => 
            c.room.name == tower.room.name && c.hits < c.hitsMax);
        if (closestHostile) {
            tower.attack(closestHostile);
        } else if (injuredCreeps.length) {
            tower.heal(injuredCreeps[0]);
        } else {
            let hasEnoughEnergyInReserve = tower.energy > tower.energyCapacity * 0.5;
            let closestDamagedStructure = tower.pos.findClosestByPath(FIND_STRUCTURES, 
                { filter: (structure) => structure.hits < structure.hitsMax });
            if (hasEnoughEnergyInReserve && closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
}
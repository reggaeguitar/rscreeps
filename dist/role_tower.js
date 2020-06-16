const _ = require('lodash');

module.exports = {
    run: function(tower) {
        const closestHostile = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        const injuredCreeps = _.filter(Game.creeps, c => 
            c.room.name == tower.room.name && c.hits < c.hitsMax);
        if (closestHostile) {
            tower.attack(closestHostile);
        } else if (injuredCreeps.length) {
            tower.heal(injuredCreeps[0]);
        } else {
            const hasEnoughEnergyInReserve = tower.energy > tower.energyCapacity * 0.5;
            // todo add logic to repair walls
            const closestDamagedStructure = tower.pos.findClosestByPath(FIND_STRUCTURES,                 
                { filter: (structure) => structure.structureType !== STRUCTURE_WALL && 
                    structure.hits < structure.hitsMax });
            if (hasEnoughEnergyInReserve && closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
}
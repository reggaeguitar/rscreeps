
module.exports = {
    run: function(tower) {
        let closestHostile = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
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
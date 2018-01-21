var _ = require('lodash');
var roleHarvester = require('role_harvester');
var roleUpgrader = require('role_upgrader');
var roleBuilder = require('role_builder'); 

var creepData = {
    'harvester': { roleObj: roleHarvester, ratio: 1 },
    'upgrader': { roleObj: roleUpgrader, ratio: 1 },
    'builder': { roleObj: roleBuilder, ratio: 1 },
};

var roles = ['harvester', 'upgrader', 'builder'];

var spawn = Game.spawns['Spawn1'];

module.exports.loop = function () {
    
    function main() {
        //printCreepRoleCounts();
        clearDeadCreepsFromMemory();
        runCreepRoles();
        spawnCreepIfPossible();
    }
    
    function printCreepRoleCounts() {
        console.log(JSON.stringify(getCreepRoleCounts()));
    }
    
    function getCreepRoleCounts() {
        var ret = {};
        for (var role in creepData) {
            var count = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
            ret[role] = count;
        }
        return ret;
    }
    
    function spawnCreepIfPossible() {
        var bodyParts = [WORK, CARRY, MOVE, MOVE, MOVE];
        var costForCreep = creepCost(bodyParts);
        //console.log('costForCreep: ' + costForCreep);
        if (costForCreep > spawn.energyCapacity) {
            console.log('Error: body parts cost too much for spawner. ');
        }
        //console.log(creepData.keys.length);
        //console.log(costForCreep);
        if (spawn.energy >= costForCreep) {
            var role = roles[_.random(roles.length - 1)];
            var harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
            if (harvesterCount <= 1) {
                role = 'harvester';
            }
            spawnCreepImpl(bodyParts, role);
        }
    }
    
    function runCreepRoles() {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            creepData[creep.memory.role].roleObj.run(creep);
        }
    }
    //
    function creepCost(bodyParts) {
        var totalCost = 0;
        for (var i = 0; i < bodyParts.length; ++i) {
            var priceForPart = BODYPART_COST[bodyParts[i]];
            totalCost += priceForPart;
        }
        return totalCost;
    }
   
    function spawnCreepImpl(bodyParts, role) {
        console.log('spawning creep with role: ' + role);
        var ret = spawn.spawnCreep(bodyParts, Game.time, { memory: { role: role } });
        console.log(ret);
    }
    
    function clearDeadCreepsFromMemory() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }
    main();
}

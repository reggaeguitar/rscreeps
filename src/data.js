var roleHarvester = require('role_harvester');
var roleUpgrader = require('role_upgrader');
var roleBuilder = require('role_builder');
var roleHauler = require('role_hauler');

module.exports = {
    creepData: {
        'harvester': { roleObj: roleHarvester },
        'upgrader': { roleObj: roleUpgrader },
        'builder': { roleObj: roleBuilder },
        'hauler': { roleObj: roleHauler },
    },
    maxHarvesterCount: 2,
    maxWorkerCount: 4,
    roleSayInterval : 5,
    goodHarvesterWorkCount: 6,
    harvesterMoveCount: 4,
    energyBuffer: 100,
};
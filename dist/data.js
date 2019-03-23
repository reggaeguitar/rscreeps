const roleHarvester = require('role_harvester');
const roleUpgrader = require('role_upgrader');
const roleBuilder = require('role_builder');
const roleHauler = require('role_hauler');
const roleClaimer = require('role_claimer');

module.exports = {
    creepData: {
        'harvester': { roleObj: roleHarvester },
        'upgrader': { roleObj: roleUpgrader },
        'builder': { roleObj: roleBuilder },
        'hauler': { roleObj: roleHauler },
        'claimer': { roleObj: roleClaimer }
    },
    minHaulerCount: 2,
    maxHarvesterCount: 2,
    maxWorkerCount: 4,
    roleSayInterval : 5,
    goodHarvesterWorkCount: 6,
    harvesterMoveCount: 1,
    energyBuffer: 100,
    harvesterTicksToLive: 50,
};